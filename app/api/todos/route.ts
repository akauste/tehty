import { Todo, addTodo, setTodoOrder } from "@/lib/db";
import { auth } from "@/auth";
import { allTodos, userTodos } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("GET Todos");
  const session = await auth();
  const user_id = session?.user?.email;

  let todos: Todo[] = [];

  if (user_id) {
    todos = await userTodos(user_id);
  } else {
    todos = await allTodos();
  }
  console.log("Todos: ", todos);

  return NextResponse.json(todos);
}

// Add new todo:
export async function POST(req: NextRequest) {
  console.log("Adding todo");
  const data = await req.json();
  const newRow = await addTodo(data);
  console.log(data, newRow);
  return NextResponse.json({ ...data, todo_id: newRow.todo_id });
}

// Update order for todos:
export async function PATCH(req: NextRequest) {
  console.log("PATCH todos");
  const session = await auth();
  const user_id = session?.user?.email;

  if (!user_id) return NextResponse.json({ error: "Authentication failed" });

  const list: { todo_id: Number; orderno: number }[] = await req.json();
  console.log("LIST:", list);

  let updated = 0;
  for (const el of list) {
    console.log(el, user_id);
    const res = await setTodoOrder(el, user_id);
    updated += Number(res.numUpdatedRows);
  }

  return NextResponse.json({ updated });
}
