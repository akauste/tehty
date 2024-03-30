import { Todo, allTodos, setTodoDone, userTodos } from "@/lib/db";
import Image from "next/image";
import { auth } from "@/auth";
import Todoer from "@/components/todo/Todoer";

export default async function Home() {
  const session = await auth();
  const user_id = session?.user?.email as string;

  const todos = await userTodos(user_id);

  console.log("Home page here");

  return (
    <>
      <h2 className="text-2xl">Todos</h2>
      <Todoer user_id={user_id} todos={todos} />
    </>
  );
}
