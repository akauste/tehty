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
type ClearUnsyncedAction = {
  type: "clear-unsynced";
  cutLength: number;
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
  | AppendRemoveTaskAction
  | ClearUnsyncedAction;

type SyncBoardOrder = {
  type: "board-order";
  board_ids: number[];
  action: any;
};
type SyncBoard = {
  type: "update-board";
  board: Board;
};
type SyncTaskOrder = {
  type: "task-order";
  board_id: number;
  task_ids: number[];
  action: any;
};
export type SyncActions = SyncBoardOrder | SyncBoard | SyncTaskOrder;

export function kanbanReducer(
  state: { boards: Board[]; unSyncedActions: SyncActions[] },
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
        draft.unSyncedActions.push({
          type: "board-order",
          board_ids: draft.boards.map((b) => b.board_id),
          action: { ...action },
        });
      });
    case "update-board":
      return produce(state, (draft) => {
        const i = draft.boards.indexOf(
          draft.boards.find((b) => b.board_id == action.board.board_id)!
        );
        draft.boards[i] = action.board;

        draft.unSyncedActions.push({
          type: "update-board",
          board: draft.boards[i],
        });
      });
    case "add-board":
      return produce(state, (draft) => {
        // draft.unSyncedActions.push({
        //   sync: "add-board",
        //   action: { ...action },
        // });
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
          draft.unSyncedActions.push({
            type: "task-order",
            board_id: action.board_id,
            task_ids: tasks?.map((t) => t.task_id),
            action: { ...action },
          });
        }
      });
    case "insert-task":
      return produce(state, (draft) => {
        // draft.unSyncedActions.push({
        //   sync: "insert-task",
        //   action: { ...action },
        // });
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
        // draft.unSyncedActions.push({
        //   sync: "update-task",
        //   action: { ...action },
        // });
        const board = draft.boards.find(
          (i) => i.board_id === action.task.board_id
        ) as Board;
        const task = board.tasks.find((t) => t.task_id === action.task.task_id);
        const index = board.tasks.indexOf(task!);
        board.tasks[index] = { ...action.task };
      });
    case "remove-task":
      return produce(state, (draft) => {
        // draft.unSyncedActions.push({
        //   sync: "remove-task",
        //   action: { ...action },
        // });
        const board = draft.boards.find((i) => i.board_id == action.board_id);
        if (board)
          board.tasks = board.tasks.filter((t) => t.task_id != action.task_id);
      });
    case "append-task":
      return produce(state, (draft) => {
        // draft.unSyncedActions.push({
        //   sync: "append-task",
        //   action: { ...action },
        // });
        const board = draft.boards.find((i) => i.board_id == action.board_id);
        board?.tasks.push({ ...action.task, orderno: board.tasks.length });
        console.log("Append:", board);
      });
    case "append-remove-task":
      return produce(state, (draft) => {
        // draft.unSyncedActions.push({
        //   sync: "append-remove-task",
        //   action: { ...action },
        // });
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
    case "clear-unsynced":
      return produce(state, (draft) => {
        draft.unSyncedActions = [];
        // draft.unSyncedActions = draft.unSyncedActions.splice(
        //   0,
        //   action.cutLength
        // ); // splice 0, length to make it work, when new changes happen while processing the old ones
      });
    default:
      throw Error("Unimplemented action:", action);
  }
}
