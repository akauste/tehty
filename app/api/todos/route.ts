import { Todo } from "@/lib/db";
import { auth } from "@/auth";
import { allTodos, userTodos } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log('GET Todos');
  const session = await auth();
  const user_id = session?.user?.email;

  let todos: Todo[] = [];

  if(user_id) {
    todos = await userTodos(user_id);
  }
  else {
    todos = await allTodos();
  }
  console.log('Todos: ', todos);

  return NextResponse.json(todos);
}