import { auth } from "@/auth";
import { Board } from "@/lib/types";
import { deleteUserBoard, updateUserBoard } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  board_id: number;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  // Implement get board, this is now only for completenes,
  // the nextjs frontend does not use this
}

// POST is actualy at: POST /api/boards (we doent know the id)

export async function PATCH(req: NextRequest, context: { params: Params }) {
  const session = await auth();
  const user_id = session?.user?.email;
  const board_id = context.params.board_id;

  if (!user_id)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );

  const data: Board = await req.json();
  console.log("Updating board", data);

  // Add some real validator
  if (
    data.board_id != board_id ||
    user_id != data.user_id ||
    !data.name?.length
  ) {
    return NextResponse.json({ error: "Invalid data", data }, { status: 400 });
  }
  data.user_id = user_id;
  const newRow = await updateUserBoard(data);
  console.log(data, newRow);
  return NextResponse.json({ ...newRow });
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  const session = await auth();
  const user_id = session?.user?.email;
  const board_id = context.params.board_id;

  if (!user_id)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );

  const res = await deleteUserBoard(user_id, board_id);
  console.log("DeleteResult: ", res);
  // Silly fix to convert BigInt to number, the answer should always be 1 or 0
  const count = Number.parseInt(res.numDeletedRows.toString());
  return NextResponse.json({ deleteCount: count });
}
