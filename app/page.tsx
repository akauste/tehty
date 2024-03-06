import { Todo, allTodos, setTodoDone, userTodos } from "@/lib/db";
import Image from "next/image";
import { auth } from '../auth';
import TodoList from "./components/todo-list";

export default async function Home() {
  const session = await auth();
  const user_id = session?.user?.email as string;

  const todos = await userTodos(user_id);

  console.log('Home page here');

  return (
    <>
      <h1 className="text-2xl">Practice app</h1>
      <p>Paragraph 1 here</p>
      
      <h2>User Todos</h2>
      <TodoList user_id={user_id} list={todos} />
    </>
  );
}