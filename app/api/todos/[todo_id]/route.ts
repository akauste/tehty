import { auth } from "@/auth";
import { deleteTodo, setTodoDone } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  todo_id: string;
};

export async function PATCH(req: NextRequest, context: { params: Promise<Params> }) {
  console.log("Patching old todo");
  const data = await req.json();
  const session = await auth();
  const user_id = session?.user?.email;
  const { todo_id: todo_id_str } = await context.params;
  const todo_id = parseInt(todo_id_str, 10);

  if (user_id) {
    setTodoDone(todo_id, !data.done);
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, context: { params: Promise<Params> }) {
  const session = await auth();
  const user_id = session?.user?.email;
  const { todo_id: todo_id_str } = await context.params;
  const todo_id = parseInt(todo_id_str, 10);

  if (user_id) {
    deleteTodo(todo_id, user_id);
  }
  return NextResponse.json({ removed: todo_id });
}
