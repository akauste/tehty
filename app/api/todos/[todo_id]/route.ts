import { auth } from "@/auth";
import { deleteTodo, setTodoDone } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  todo_id: number;
};

export async function PATCH(req: NextRequest, context: { params: Params }) {
  console.log("Patching old todo");
  const data = await req.json();
  const session = await auth();
  const user_id = session?.user?.email;

  if (user_id) {
    setTodoDone(context.params.todo_id, !data.done);
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  const session = await auth();
  const user_id = session?.user?.email;

  if (user_id) {
    deleteTodo(context.params.todo_id, user_id);
  }
  return NextResponse.json({ removed: context.params.todo_id });
}
