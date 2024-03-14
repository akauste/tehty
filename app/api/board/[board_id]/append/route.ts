import { auth } from "@/auth";
import { addTask, appendBoardTask } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  board_id: number;
};

export async function POST(req: NextRequest, context: { params: Params }) {
  const session = await auth();
  const user_id = session?.user?.email;

  console.log("board/[board_id]/append route");
  if (user_id) {
    console.log("Append task to board", context.params.board_id);
    const data = await req.json();

    const newRow = await appendBoardTask(
      context.params.board_id,
      data.task_id,
      user_id
    );
    console.log("appendBoardTask returned: ", newRow);
    return NextResponse.json({ ...newRow });
  }
}
