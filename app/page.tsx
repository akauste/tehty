import { allTodos, setTodoDone } from "@/lib/db";
import Image from "next/image";
import TodoItem from "./components/todo-item";

export default async function Home() {
  console.log('Home page here');
  const todos = await getServerSideProps();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-2xl">Practice app</h1>
        <p>Paragraph 1 here</p>
        <ul className="my-8 list-disc">
          { todos.map((t, i) => <TodoItem key={i} todo={t} />) }
        </ul>
      </div>
    </main>
  );
}

async function getServerSideProps() {
  const todos = await allTodos();
  return todos;
}