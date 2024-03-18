import { auth } from "@/auth";
import { updateTask } from "@/lib/db";
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

  console.log("PATCH /api/task/" + context.params.task_id);
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

// POST is actualy at: POST /api/Task (we doent know the id)

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
  //return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  const session = await auth();
  const user_id = session?.user?.email;

  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  // Implement delete task
  console.log("PATCH /api/task/" + context.params.task_id);
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
