import { auth } from "@/auth";
import { NewBoard, createBoard, updateBoardOrder } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  const user_id = session?.user?.email;

  if (!user_id)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );

  console.log("Adding task");
  const data: NewBoard = await req.json();

  // Add some real validator
  if (!data.name?.length) {
    return NextResponse.json({ error: "Invalid data", data }, { status: 400 });
  }
  data.user_id = user_id;
  const newRow = await createBoard(data);
  console.log(data, newRow);
  return NextResponse.json({ ...newRow, tasks: [] });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  const user_id = session?.user?.email;

  if (!user_id)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );

  console.log("Setting new board order");
  const board_ids: number[] = await req.json();
  const ret = await updateBoardOrder(board_ids, user_id);
  return NextResponse.json(ret.toString());
}
