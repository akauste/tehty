import { createKysely } from "@vercel/postgres-kysely";
import {
  Kysely,
  RawBuilder,
  PostgresDialect,
  Generated,
  Selectable,
  Insertable,
  Updateable,
  sql,
} from "kysely";
import { Pool } from "pg";

export interface Database {
  todo: TodoTable;
  board: BoardTable;
  task: TaskTable;
}

export const db = !process.env.VERCEL_ENV
  ? new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          database: "mydb",
          host: "localhost",
          user: "myuser",
          port: 5432,
          password: "mypassword",
          max: 10,
        }),
      }),
    })
  : createKysely<Database>();

function json<T>(value: T): RawBuilder<T> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`;
}

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

/*
  KANBAN tables & querys:
*/

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

type Step = {
  name: string;
  done: boolean;
};

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
  steps?: Step[];
}

export type Task = Selectable<TaskTable>; // & { tags: string[] };
export type NewTask = Insertable<TaskTable>;
export type TaskUpdate = Updateable<TaskTable>;

/* 
  BOARD Crud operations:
*/

export async function createBoard(board: NewBoard) {
  return db
    .insertInto("board")
    .values(board)
    .returningAll()
    .executeTakeFirstOrThrow();
}
// export async function getBoard(board_id: Board) {}
export async function getUserBoard(user_id: string, board_id: number) {
  return db
    .selectFrom("board")
    .selectAll()
    .where((eb) =>
      eb.and([eb("user_id", "=", user_id), eb("board_id", "=", board_id)])
    )
    .executeTakeFirst();
}

export async function userBoards(user_id: string) {
  return db
    .selectFrom("board")
    .selectAll()
    .where("user_id", "=", user_id)
    .orderBy(["orderno", "board_id"])
    .execute();
}

export async function updateUserBoard(
  board: BoardUpdate & { board_id: number; user_id: string }
) {
  return db
    .updateTable("board")
    .set(board)
    .where((eb) =>
      eb.and([
        eb("user_id", "=", board.user_id),
        eb("board_id", "=", board.board_id),
      ])
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}
export async function deleteUserBoard(user_id: string, board_id: number) {
  return db
    .deleteFrom("board")
    .where((eb) =>
      eb.and([eb("user_id", "=", user_id), eb("board_id", "=", board_id)])
    )
    .executeTakeFirst();
}

export async function updateBoardOrder(board_ids: number[], user_id: string) {
  const proms: any[] = [];
  board_ids.forEach((id, idx) => {
    const p = db
      .updateTable("board")
      .set({ orderno: idx })
      .where((eb) =>
        eb.and([eb("board_id", "=", id), eb("user_id", "=", user_id)])
      )
      .execute();
    proms.push(p);
  });
  return Promise.all(proms);
}

export async function moveToBoardTask(
  board_id: number,
  task_id: number,
  user_id: string,
  index: number
) {
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
  if (!task.steps) {
    task.steps = [];
  }
  const res = await db
    .selectFrom("task")
    .select(({ fn, val, ref }) => [fn.max<number>("orderno").as("orderno")])
    .where("board_id", "=", task.board_id!)
    .executeTakeFirst();

  task.orderno = res ? res.orderno + 1 : 0;

  return db
    .insertInto("task")
    .values({ ...task, steps: json(task.steps) })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getUserTask(user_id: string, task_id: number) {
  return db
    .selectFrom("task")
    .selectAll()
    .where((eb) =>
      eb.and([eb("user_id", "=", user_id), eb("task_id", "=", task_id)])
    )
    .executeTakeFirst();
}

export async function updateTask(task: TaskUpdate) {
  if (!task.task_id || !task.user_id)
    throw new Error("task_id or user_id missing");
  // Implement update
  return db
    .updateTable("task")
    .set({ ...task, steps: json(task.steps) }) // Possible problem: steps not included in update query, but they exist
    .where((eb) =>
      eb.and([
        eb("task_id", "=", task.task_id as number),
        eb("user_id", "=", task.user_id as string),
      ])
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteUserTask(user_id: string, task_id: number) {
  return db
    .deleteFrom("task")
    .where((eb) =>
      eb.and([eb("user_id", "=", user_id), eb("task_id", "=", task_id)])
    )
    .executeTakeFirst();
}

export async function sortBoardTasks(board_id: number, task_ids: number[]) {
  /*
    UPDATE task t 
    SET board_id=in.board_id, orderno=in.orderno 
    FROM (VALUES (
      board_id, orderno, task_id),
      ()
    ) AS in(board_id, orderno, task_id)
    WHERE t.task_id = in.task_id
  */
  const proms: Promise<any>[] = [];
  task_ids.forEach((task_id, orderno) => {
    const p = db
      .updateTable("task")
      .set({ board_id, orderno: orderno })
      .where("task_id", "=", task_id)
      .execute();
    proms.push(p);
  });
  return Promise.all(proms);
}
