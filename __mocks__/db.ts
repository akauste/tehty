import { NewTask, Task } from "@/lib/db";

export const userBoards = async () => {
  return Promise.resolve([
    {
      board_id: 1,
      orderno: 1, // number | null;
      user_id: "test", // string;
      name: "Board 1",
      background_color: "blue",
      show: true,
      show_done_tasks: true,
      tasks: [],
    },
    {
      board_id: 2,
      orderno: 2, // number | null;
      user_id: "test", // string;
      name: "Board 2",
      background_color: "red",
      show: true,
      show_done_tasks: true,
      tasks: [],
    },
  ]);
};

export const addTask = async (data: NewTask) => {
  const ret = {
    ...data,
    task_id: 123,
  };
  return Promise.resolve(ret);
};

export const userTasks = async () => {
  return Promise.resolve([]);
};

export const updateTask = async (task: Task) => {
  const ret = { ...task };
  return Promise.resolve(ret);
};

export const userTodos = async (user_id: string) => {
  return [
    { orderno: 0, todo_id: 321, task: "First", done: false, user_id },
    { orderno: 0, todo_id: 12, task: "Second", done: true, user_id },
    { orderno: 0, todo_id: 1000, task: "Third", done: false, user_id },
  ];
};
