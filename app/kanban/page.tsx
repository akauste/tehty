import Kanban from "@/components/kanban/kanban";
import { auth } from "@/auth";
import { Task, BoardTask, userBoards, userTasks } from "@/lib/db";

const getBoards = async (user_id: string): Promise<BoardTask[]> => {
  const boards = await userBoards(user_id);
  const tasks = await userTasks(user_id);
  const boardTasks: { [key: number]: Task[] } = { 0: [] };
  boards.forEach((b) => (boardTasks[b.board_id] = []));
  tasks.forEach(
    (t) =>
      boardTasks[t.board_id]
        ? boardTasks[t.board_id].push({ ...t }) // tags: [] })
        : boardTasks[0].push({ ...t, board_id: 0 }) // tags: [] })
  );
  return boards.map((b) => ({ ...b, tasks: boardTasks[b.board_id] }));
};

export default async function KanbanPage() {
  const session = await auth();
  const user_id = session?.user?.email as string;

  const boards = await getBoards(user_id);
  console.log(boards);

  return (
    <>
      <h2>Kanban</h2>
      <p>
        Point of this is testing the layouts for different levels, here the top
        layout is showing the main header etc., but there is also a layout for
        info pages, and routes under that are showing that.
      </p>

      <Kanban user_id="testuser" boards={boards} />
    </>
  );
}
