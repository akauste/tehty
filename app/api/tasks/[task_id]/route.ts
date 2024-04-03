import { auth } from "@/auth";
import { deleteUserTask, updateTask } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  task_id: number;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  // Implement get task, this is now only for completenes,
  // the nextjs frontend does not use this
  const session = await auth();
  const user_id = session?.user?.email;

  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("GET /api/tasks/" + context.params.task_id);
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function PATCH(req: NextRequest, context: { params: Params }) {
  const session = await auth();
  const user_id = session?.user?.email;

  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  // Implement update task
  const updatedTask = await updateTask(data);
  console.log("PATCH /api/task/" + context.params.task_id);
  return NextResponse.json(updatedTask);
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  const session = await auth();
  const user_id = session?.user?.email;

  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("DELETE /api/task/" + context.params.task_id);
  const res = await deleteUserTask(user_id, context.params.task_id);
  const count = Number.parseInt(res.numDeletedRows.toString());
  return NextResponse.json({ deleteCount: count });
}
