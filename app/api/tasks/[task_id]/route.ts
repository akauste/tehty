import { auth } from "@/auth";
import { deleteUserTask, updateTask } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  task_id: string;
};

export async function GET(req: NextRequest, context: { params: Promise<Params> }) {
  // Implement get task, this is now only for completenes,
  // the nextjs frontend does not use this
  const session = await auth();
  const user_id = session?.user?.email;
  const { task_id: task_id_str } = await context.params;
  const task_id = parseInt(task_id_str, 10);

  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("GET /api/tasks/" + task_id);
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function PATCH(req: NextRequest, context: { params: Promise<Params> }) {
  const session = await auth();
  const user_id = session?.user?.email;
  const { task_id: task_id_str } = await context.params;
  const task_id = parseInt(task_id_str, 10);

  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  // Implement update task
  const updatedTask = await updateTask(data);
  console.log("PATCH /api/task/" + task_id);
  return NextResponse.json(updatedTask);
}

export async function DELETE(req: NextRequest, context: { params: Promise<Params> }) {
  const session = await auth();
  const user_id = session?.user?.email;
  const { task_id: task_id_str } = await context.params;
  const task_id = parseInt(task_id_str, 10);

  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("DELETE /api/task/" + task_id);
  const res = await deleteUserTask(user_id, task_id);
  const count = Number.parseInt(res.numDeletedRows.toString());
  return NextResponse.json({ deleteCount: count });
}
