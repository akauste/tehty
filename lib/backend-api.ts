/*
  Here we define the interface for backend calls, the goal is
  to allow easy implementation of different backends ie (REST-API & localStorage)
*/

import { Board, NewBoard, NewTask, Task } from "@/lib/db";

export type IKanbanBackend = IBoardBackend & ITaskBackend;

interface IBoardBackend {
  getBoard: (board_id: number) => Promise<Board>;
  createBoard: (board: NewBoard) => Promise<Board>; // Return value is the status
  updateBoard: (board: Board) => Promise<Board>; // Promise<[number, string]>;
  deleteBoard: (board_id: number) => Promise<number>; // Promise<[number, string]>;
  sortBoards: (board_ids: number[]) => Promise<number>; // Promise<[number, string]>;
}

interface ITaskBackend {
  getTask: (task_id: number) => Promise<Task>;
  createTask: (task: Partial<Task>) => Promise<Task>; // Return value is the status
  updateTask: (task: Task) => Promise<Task>;
  deleteTask: (task_id: number) => Promise<number>;
  sortTasks: (board_id: number, task_ids: number[]) => Promise<number>;
}

export const RESTbackend: IKanbanBackend = {
  getBoard: async (board_id: number) => {
    const ret = await fetch("/api/boards/" + board_id);
    const board: Board = await ret.json();
    return board;
  },
  createBoard: async (board: NewBoard) => {
    const res = await fetch("/api/boards/", {
      method: "POST",
      body: JSON.stringify(board),
    });
    const data: Board = await res.json();
    return data;
  },
  updateBoard: async (board: Board) => {
    const res = await fetch("/api/boards/" + board.board_id, {
      method: "PATCH",
      body: JSON.stringify(board),
    });
    const data = await res.json();
    return data; // Promise<[number, string]>;
  },
  deleteBoard: async (board_id: number) => {
    const ret = await fetch("/api/boards/" + board_id, { method: "DELETE" });
    const data = ret.json();
    return data; // Promise<[number, string]>;
  },
  sortBoards: async (board_ids: number[]) => {
    const ret = await fetch("/api/boards", {
      method: "PATCH",
      body: JSON.stringify(board_ids),
    });
    const data = await ret.json();
    return data;
  },
  getTask: async (task_id: number) => {
    const ret = await fetch("/api/tasks/" + task_id);
    return await ret.json();
  },
  createTask: async (task: Partial<Task>) => {
    const ret = await fetch("/api/tasks/", {
      method: "POST",
      body: JSON.stringify(task),
    });
    return await ret.json();
  },
  updateTask: async (task: Task) => {
    const ret = await fetch("/api/tasks/" + task.task_id, {
      method: "PATCH",
      body: JSON.stringify(task),
    });
    return await ret.json();
  },
  deleteTask: async (task_id: number) => {
    const ret = await fetch("/api/tasks/" + task_id, { method: "DELETE" });
    return await ret.json();
  },
  sortTasks: async (board_id: number, task_ids: number[]) => {
    const ret = await fetch("/api/boards/" + board_id + "/tasks", {
      method: "PATCH",
      body: JSON.stringify(task_ids),
    });
    return await ret.json();
  },
};
export default RESTbackend;
