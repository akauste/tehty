import { auth } from "@/auth";
import { sortBoardTasks } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  board_id: string;
};

// PATCH /api/boards/[board_id]/tasks
export async function PATCH(req: NextRequest, context: { params: Promise<Params> }) {
  const session = await auth();
  const user_id = session?.user?.email;
  const { board_id: board_id_str } = await context.params;
  const board_id = parseInt(board_id_str, 10);

  console.log("PATCH board/[board_id]/tasks");
  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("Move task to board", board_id);
  const task_ids = await req.json();

  const count = await sortBoardTasks(board_id, task_ids);
  console.log("tried to update: ", count);
  return NextResponse.json(count.toString());
}
