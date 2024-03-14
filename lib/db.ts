//import { Todo } from '@/app/components/todo-item';
import { createKysely } from "@vercel/postgres-kysely";
import { Generated, Selectable, Insertable, Updateable, sql } from "kysely";

interface Database {
  todo: TodoTable;
  board: BoardTable;
  task: TaskTable;
}

const db = createKysely<Database>();

export async function allTodos() {
  return db.selectFrom("todo").selectAll().execute();
}

export async function userTodos(user_id: string) {
  return db
    .selectFrom("todo")
    .selectAll()
    .where("user_id", "=", user_id)
    .orderBy(["orderno", "todo_id"])
    .execute();
}

export async function addTodo(todo: NewTodo) {
  return db
    .insertInto("todo")
    .values({ ...todo, done: false, orderno: null })
    .returning(["todo_id"])
    .executeTakeFirstOrThrow();
}

export async function deleteTodo(id: Number, user_id: string) {
  return db.deleteFrom("todo").where("todo_id", "=", id).execute();
}

export async function setTodoOrder(
  { todo_id, orderno }: { todo_id: Number; orderno: number },
  user_id: string
) {
  const result = await db
    .updateTable("todo")
    .set({
      orderno: orderno,
    })
    .where(({ and, eb }) =>
      and([eb("todo_id", "=", todo_id), eb("user_id", "=", user_id)])
    )
    .executeTakeFirstOrThrow();
  return result;
}

export async function setTodoDone(todo_id: Number, done: boolean) {
  return db
    .updateTable("todo")
    .set({ done })
    .where("todo_id", "=", todo_id)
    .execute();
}

export interface TodoTable {
  todo_id: Generated<Number>;
  orderno: number | null;
  user_id: string;
  task: string;
  done: boolean;
}

export type Todo = Selectable<TodoTable>;
export type NewTodo = Insertable<TodoTable>;
export type TodoUpdate = Updateable<TodoTable>;

export interface BoardTable {
  board_id: Generated<number>;
  orderno: number | null;
  user_id: string;
  name: string;
  background_color: string;
  show: boolean;
  show_done_tasks: boolean;
}

export type Board = Selectable<BoardTable> & { tasks: Task[] };
export type NewBoard = Insertable<BoardTable>;
export type BoardUpdate = Updateable<BoardTable>;
export type BoardTask = Board & { tasks: Task[] };

export interface TaskTable {
  task_id: Generated<number>;
  board_id: number;
  orderno: number | null;
  user_id: string;
  name: string;
  background_color: string;
  description: string;
  due_date: Date | null;
  done: boolean;
}

export type Task = Selectable<TaskTable>; // & { tags: string[] };
export type NewTask = Insertable<TaskTable>;
export type TaskUpdate = Updateable<TaskTable>;

export async function userBoards(user_id: string) {
  return db
    .selectFrom("board")
    .selectAll()
    .where("user_id", "=", user_id)
    .orderBy(["orderno", "board_id"])
    .execute();
}

export async function appendBoardTask(
  board_id: number,
  task_id: number,
  user_id: string
) {
  return db
    .updateTable("task")
    .set((eb) => ({
      board_id,
      orderno: eb.fn.coalesce(
        eb(
          eb
            .selectFrom("task")
            .select(eb.fn.max<number>("orderno").as("new_order"))
            .where("board_id", "=", board_id)
            .limit(1),
          "+",
          1
        ),
        sql<number>`1`
      ),
    }))
    .where((eb) =>
      eb.and([eb("task_id", "=", task_id), eb("user_id", "=", user_id)])
    )
    .returningAll()
    .executeTakeFirst();
}

export async function moveToBoardTask(
  board_id: number,
  task_id: number,
  user_id: string,
  index: number
) {
  // This will set orderno to 1, 2... leaving just one gap for the new index
  /*
    WITH ordering AS (
      SELECT task_id, row_number() OVER (ORDER BY orderno) as "orderno"
        FROM task
        WHERE board_id=1
        ORDER BY orderno)
    UPDATE task t
      SET orderno=(CASE WHEN o.orderno <=2 THEN o.orderno ELSE o.orderno+1 END)
    FROM ordering AS o 
    WHERE t.task_id=o.task_id 
  */
  // First step is to update all the previous values to run in same order as before,
  // but leave a gap for the newly dropped task
  console.log("set ordernos of old");
  await sql`WITH ordering AS (
    SELECT task_id, row_number() OVER (ORDER BY orderno) as "orderno"
      FROM task
      WHERE board_id=${board_id}
      ORDER BY orderno)
  UPDATE task t
    SET orderno=(CASE WHEN o.orderno <=${index} THEN o.orderno ELSE o.orderno+1 END)
  FROM ordering AS o 
  WHERE t.task_id=o.task_id`.execute(db);

  return db
    .updateTable("task")
    .set((eb) => ({
      board_id,
      orderno: index + 1,
    }))
    .where((eb) =>
      eb.and([eb("task_id", "=", task_id), eb("user_id", "=", user_id)])
    )
    .returningAll()
    .executeTakeFirst();
}

export async function userTasks(user_id: string) {
  return db
    .selectFrom("task")
    .selectAll()
    .where("user_id", "=", user_id)
    .orderBy(["orderno", "task_id"])
    .execute();
}

export async function addTask(task: NewTask) {
  const res = await db
    .selectFrom("task")
    .select(({ fn, val, ref }) => [fn.max<number>("orderno").as("orderno")])
    .where("board_id", "=", task.board_id!)
    .executeTakeFirst();

  task.orderno = res ? res.orderno + 1 : 1;

  return db
    .insertInto("task")
    .values({ ...task })
    .returningAll()
    .executeTakeFirstOrThrow();
}
