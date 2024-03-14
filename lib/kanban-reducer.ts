import { produce } from "immer";
import { Board, Task } from "@/lib/db";

type MoveBoardAction = {
  type: "move-board";
  board_id: number;
  atIndex: number;
};
type UpdateBoardAction = {
  type: "update-board";
  //index: number;
  board: Board;
};
type AddBoardAction = {
  type: "add-board";
  board: Board;
};
type MoveTaskAction = {
  type: "move-task";
  board_id: number;
  removeIndex: number;
  atIndex: number;
  task: Task;
};
type InsertTaskAction = {
  type: "insert-task";
  board_id: number;
  atIndex: number;
  newTask: Task;
};
type UpdateTaskAction = {
  type: "update-task";
  task: Task;
};
type RemoveTaskAction = {
  type: "remove-task";
  board_id: number;
  task_id: number;
};
type AppendTaskAction = {
  type: "append-task";
  board_id: number;
  task: Task;
};
type AppendRemoveTaskAction = {
  type: "append-remove-task";
  board_id: number;
  task: Task;
};

export type KanbanActions =
  | MoveBoardAction
  | UpdateBoardAction
  | AddBoardAction
  | MoveTaskAction
  | InsertTaskAction
  | UpdateTaskAction
  | RemoveTaskAction
  | AppendTaskAction
  | AppendRemoveTaskAction;

export function kanbanReducer(
  state: { boards: Board[] },
  action: KanbanActions
) {
  switch (action.type) {
    case "move-board":
      return produce(state, (draft) => {
        const board = draft.boards.find((b) => b.board_id == action.board_id);
        if (board) {
          draft.boards.splice(draft.boards.indexOf(board), 1);
          draft.boards.splice(action.atIndex, 0, board);
        }
      });
    case "update-board":
      return produce(state, (draft) => {
        const i = draft.boards.indexOf(
          draft.boards.find((b) => b.board_id == action.board.board_id)!
        );
        draft.boards[i] = action.board;
      });
    case "add-board":
      return produce(state, (draft) => {
        draft.boards.push(action.board);
      });
    case "move-task":
      return produce(state, (draft) => {
        const tasks = draft.boards.find(
          (i) => i.board_id == action.board_id
        )?.tasks;
        if (tasks) {
          tasks.splice(action.removeIndex, 1);
          tasks.splice(action.atIndex, 0, {
            ...action.task,
            board_id: action.board_id,
          });
        }
      });
    case "insert-task":
      return produce(state, (draft) => {
        const tasks = draft.boards.find(
          (i) => i.board_id == action.board_id
        )?.tasks;
        tasks?.splice(action.atIndex, 0, {
          ...action.newTask,
          board_id: action.board_id,
        });
      });
    case "update-task":
      return produce(state, (draft) => {
        const board = draft.boards.find(
          (i) => i.board_id === action.task.board_id
        ) as Board;
        const task = board.tasks.find((t) => t.task_id === action.task.task_id);
        const index = board.tasks.indexOf(task!);
        board.tasks[index] = { ...action.task };
      });
    case "remove-task":
      return produce(state, (draft) => {
        const board = draft.boards.find((i) => i.board_id == action.board_id);
        if (board)
          board.tasks = board.tasks.filter((t) => t.task_id != action.task_id);
      });
    case "append-task":
      return produce(state, (draft) => {
        const board = draft.boards.find((i) => i.board_id == action.board_id);
        board?.tasks.push({ ...action.task, orderno: board.tasks.length });
        console.log("Append:", board);
      });
    case "append-remove-task":
      return produce(state, (draft) => {
        const oldBoard = draft.boards.find(
          (i) => i.board_id == action.task.board_id
        );
        if (oldBoard)
          oldBoard.tasks = oldBoard.tasks.filter(
            (t) => t.task_id != action.task.task_id
          );

        const board = draft.boards.find((i) => i.board_id == action.board_id);
        board?.tasks.push({ ...action.task, board_id: action.board_id });
      });
    default:
      throw Error("Unimplemented action:", action);
  }
}
