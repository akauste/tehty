import { Generated, Selectable, Insertable, Updateable } from "kysely";

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
