import { auth } from "@/auth";
import { moveToBoardTask, sortBoardTasks } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  board_id: number;
};

// PATCH /api/boards/[board_id]/tasks
export async function PATCH(req: NextRequest, context: { params: Params }) {
  const session = await auth();
  const user_id = session?.user?.email;

  console.log("PATCH board/[board_id]/tasks");
  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("Move task to board", context.params.board_id);
  const task_ids = await req.json();

  const count = await sortBoardTasks(context.params.board_id, task_ids);
  console.log("tried to update: ", count);
  return NextResponse.json(count.toString());
}
