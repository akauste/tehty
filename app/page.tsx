import { auth } from "../auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();
  const user_id = session?.user?.email as string;

  console.log("Home page here");

  return (
    <>
      <h1 className="text-2xl">Practice app</h1>
      <p>Practice app has two tools:</p>
      <ol className="pl-4 py-2 space-y-2 list-decimal">
        <li>
          Todo list is simple a simple todo list where the tasks are simple text
          strings which can be marked as done or deleted entirely. Items can be
          sorted via drag and drop.
        </li>

        <li>
          Kanban board where you can create any number of named boards and then
          add tasks to those boards. Boards can be sorted via drag and drop.
          Same goes to tasks that can be dragged and dropped. All the data is
          saved to postgres database.
        </li>
      </ol>
      {!session?.user && (
        <p className="p-10 text-center">
          <a
            href="/api/auth/signin"
            className="p-4 bg-sky-600 text-sky-100 hover:bg-sky-500 hover:text-white rounded-xl"
          >
            Sign in
          </a>
        </p>
      )}
    </>
  );
}
