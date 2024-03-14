import { auth } from "@/auth";
import { addTask, moveToBoardTask, updateBoardOrder } from "@/lib/db";
import { SyncActions } from "@/lib/kanban-reducer";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  board_id: number;
};

export async function POST(req: NextRequest, context: { params: Params }) {
  const session = await auth();
  const user_id = session?.user?.email;

  console.log("kanban/sync route");
  if (user_id) {
    const data: SyncActions[] = await req.json();

    const boardOrder = data.findLast((d) => d.type == "board-order");
    if (boardOrder && boardOrder.type == "board-order") {
      await updateBoardOrder(boardOrder.board_ids, user_id);
    }

    return NextResponse.json({ message: "board order updated" });
  }
}
