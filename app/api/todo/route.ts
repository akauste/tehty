import { auth } from "@/auth";
import { addTodo, deleteTodo, setTodoDone } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log('Adding todo');
  const data = await req.json();
  const newRow = await addTodo(data);
  console.log(data, newRow);
  return NextResponse.json({...data, todo_id: newRow.todo_id});
}

export async function PATCH(req: NextRequest) {
  console.log('Patching old todo');
  const data = await req.json();

  setTodoDone(data.todo_id, !data.done);

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const user_id = session?.user?.email;

  console.log('Delete todo');
  const data = await req.json();
  if(user_id) {
    deleteTodo(data.todo_id, user_id);
  }
  return NextResponse.json({removed: data.todo_id});
}