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

/*
  info: default toast type, information about action happening
  success: something was successfully done
  warning: warn about something
  error: display error when something failed
  debug: status data that should not be shown normally, but what can be easily enabled
*/
export type ToastType = "info" | "warning" | "error" | "success" | "debug";
export type Toast = {
  id: number;
  type: ToastType;
  name: string;
  description?: string;
  autoRemove?: number;
};
export type ToastUpdate = Partial<Omit<Toast, "id">>;

export type ToastContextType = {
  toasts: Toast[];
  addToast: ({
    type,
    name,
    description,
    autoRemove,
  }: {
    type?: ToastType;
    name: string;
    description?: string;
    autoRemove?: number;
  }) => number; // id
  updateToast: (id: number, value: ToastUpdate) => void;
  removeToast: (id: number) => void;
};
