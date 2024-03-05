import { allTodos, setTodoDone } from "@/lib/db";
import Image from "next/image";
import TodoItem from "./components/todo-item";
import { auth } from '../auth';
import TodoAdd from "./components/todo-add";
import TodoList from "./components/todo-list";

export default async function Home() {
  const session = await auth();
  const user_id = session?.user?.email as string;

  console.log('Home page here');
  //const todos = await getServerSideProps();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full  text-sm lg:flex">
        <h1 className="text-2xl">Practice app</h1>
        <p>Paragraph 1 here</p>

        <h2>User Todos</h2>
        <TodoList user_id={user_id} />
      </div>
    </main>
  );
}

/*
async function getServerSideProps() {
  const todos = await allTodos();
  return todos;
}
*/