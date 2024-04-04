"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardList from "./board-list";
import { BoardTask } from "@/lib/db";
import { Dispatch, useEffect, useReducer, useState } from "react";
import { Board, Task } from "@/lib/db";
import AddBoardButton from "./add-board-button";
import HiddenBoards from "./hidden-boards";
import { KanbanActions, kanbanReducer } from "@/lib/kanban-reducer";
import { CheckCircleOutline, Sync, Update } from "@mui/icons-material";
import backend, { IKanbanBackend } from "@/lib/backend-api";
import AddTaskButton from "./add-task-button";

const unSyncedActions: any[] = [];

export default function Kanban({
  user_id,
  boards,
}: {
  user_id: string;
  boards: BoardTask[];
}) {
  const [state, dispatch] = useReducer(kanbanReducer, {
    boards,
    unSyncedActions,
  });
  const [syncStatus, setSyncStatus] = useState({ sync: false, error: "" });

  const hiddenBoards = state.boards.filter((b) => !b.show);
  const visibleBoards = state.boards.filter((b) => b.show);

  const dispatchBackend = (action: KanbanActions) => {
    switch (action.type) {
      case "add-board":
        backend
          .createBoard({
            ...action.board,
            user_id,
            orderno: state.boards.length,
          })
          .then((newBoard) =>
            dispatch({
              type: "add-board",
              board: newBoard,
            })
          )
          .catch((err) =>
            setSyncStatus({ sync: false, error: "Failed to create board" })
          );
        break;
      case "update-board":
        backend
          .updateBoard(action.board)
          //.then((ret) => console.warn(ret))
          .catch((err) => {
            if (err) console.warn("Received ERROR: ", err);
            setSyncStatus({ sync: false, error: "Failed to update board" });
          });
        dispatch(action);
        break;
      case "delete-board":
        backend.deleteBoard(action.board_id).catch((err) => {
          setSyncStatus({
            sync: false,
            error: "Failed to delete board, please refresh page",
          });
        });
        dispatch(action);
        break;
      case "move-board":
        const board_ids = state.boards
          .map((b) => b.board_id)
          .filter((id) => id != action.board_id);
        board_ids.splice(action.atIndex, 0, action.board_id);
        backend.sortBoards(board_ids);
        dispatch(action);
        break;
      //case "move-task":
      //case "clear-unsynced":
      case "update-task":
        console.warn("dispatchBackend(update-task: ...)");
        backend.updateTask(action.task);
        dispatch(action);
        break;
      case "append-task":
        //const newTask = await backend.createTask(action.task);
        backend.createTask(action.task).then((newTask) => {
          if (newTask.due_date) newTask.due_date = new Date(newTask.due_date);
          dispatch({
            type: "append-task",
            board_id: newTask.board_id,
            task: newTask,
          });
        });
        break;
      case "append-remove-task":
        let task_ids = state.boards
          .find((b) => b.board_id == action.board_id)
          ?.tasks.map((t) => t.task_id)
          .filter((id) => id != action.task.task_id);
        task_ids?.splice(action.index, 0, action.task.task_id);
        console.warn("Saving task order (ids): " + task_ids);
        if (task_ids) backend.sortTasks(action.board_id, task_ids);
        dispatch(action);
        break;
      case "remove-task":
        backend.deleteTask(action.task_id);
        dispatch(action);
        break;
      default:
        dispatch(action);
    }
  };

  console.log("STATE", state);
  return (
    <DndProvider backend={HTML5Backend}>
      {syncStatus.error && (
        <div className="bg-red-300 border border-red-700 rounded p-2 text-red-800">
          <button
            className="float-right"
            onClick={() => setSyncStatus((s) => ({ ...s, error: "" }))}
          >
            X
          </button>
          {syncStatus.error}
        </div>
      )}
      <div className="flex w-full my-2 gap-2">
        <h1 className="flex-grow text-2xl bold">Kanban board</h1>
        <div>
          {syncStatus.sync ? "Syncing" : ""}
          {syncStatus.error ? "Failed to sync" : ""}
        </div>
        {hiddenBoards.length > 0 && (
          <HiddenBoards
            hiddenBoards={hiddenBoards}
            dispatch={dispatchBackend}
          />
        )}
        <AddTaskButton
          visibleBoards={visibleBoards}
          dispatch={dispatchBackend}
        />
        <AddBoardButton user_id={user_id} dispatch={dispatchBackend} />
      </div>
      {state.boards.length ? (
        <BoardList
          user_id={user_id}
          list={state.boards}
          dispatch={dispatchBackend}
        />
      ) : (
        <section className="space-y-2">
          <p>You don't have any boards added yet.</p>
          <p>
            Start by creating some boards with "Add board" button. You can sort
            the boards with drag and drop.
          </p>
          <p>
            Then you can start adding tasks. Tasks can be dragged around to
            reorder them and to move them to other boards.
          </p>
        </section>
      )}
      <br />
    </DndProvider>
  );
}
