"use client";
import BoardList from "./board-list";
import { BoardTask, Task, ToastContextType } from "@/lib/types";
import { useContext, useReducer } from "react";
import AddBoardButton from "./add-board-button";
import HiddenBoards from "./hidden-boards";
import { KanbanActions, kanbanReducer } from "@/lib/kanban-reducer";
import backend from "@/lib/backend-api";
import AddTaskButton from "./add-task-button";
import AddExampleData from "./add-example-data";
import { ToastContext } from "@/context/toaster-context";
import Toaster from "../ui/toaster";

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
  const { addToast, updateToast, removeToast } = useContext(
    ToastContext
  ) as ToastContextType;

  const hiddenBoards = state.boards.filter((b) => !b.show);
  const visibleBoards = state.boards.filter((b) => b.show);

  const dispatchBackend = (action: KanbanActions) => {
    switch (action.type) {
      case "add-board": {
        const toastId = addToast({
          name: "Creating board",
        });
        backend
          .createBoard({
            ...action.board,
            user_id,
            orderno: state.boards.length,
          })
          .then((newBoard) => {
            dispatch({
              type: "add-board",
              board: newBoard,
            });
            updateToast(toastId, {
              type: "success",
              description: "Board created",
              autoRemove: 500,
            });
          })
          .catch((err) => {
            updateToast(toastId, {
              type: "error",
              description: "Failed to create board",
            });
          });
        break;
      }
      case "update-board": {
        const toastId = addToast({
          type: "debug",
          name: "Update board",
        });
        backend
          .updateBoard(action.board)
          .then((ret) =>
            updateToast(toastId, { type: "success", autoRemove: 1 })
          )
          .catch((err) => {
            updateToast(toastId, {
              type: "error",
              description: "Failed to update board " + err.message,
            });
            if (err) console.warn("Received ERROR: ", err);
          });
        dispatch(action);
        break;
      }
      case "delete-board": {
        const toastId = addToast({ name: "Deleting board" });
        backend
          .deleteBoard(action.board_id)
          .then((res) => updateToast(toastId, { autoRemove: 1 }))
          .catch((err) => {
            updateToast(toastId, {
              type: "error",
              description: "Failed to delete board, please refresh page",
            });
          });
        dispatch(action);
        break;
      }
      case "move-board": {
        const toastId = addToast({ name: "Move board" });
        const board_ids = state.boards
          .map((b) => b.board_id)
          .filter((id) => id != action.board_id);
        board_ids.splice(action.atIndex, 0, action.board_id);
        backend
          .sortBoards(board_ids)
          .then((res) => updateToast(toastId, { autoRemove: 1 }));
        dispatch(action);
        break;
      }
      //case "move-task":
      //case "clear-unsynced":
      case "update-task":
        console.warn("dispatchBackend(update-task: ...)");
        backend.updateTask(action.task);
        dispatch(action);
        break;
      case "append-task": {
        const toastId = addToast({ name: "Create task: " + action.task.name });
        backend
          .createTask(action.task)
          .then((newTask) => {
            if (newTask.due_date) newTask.due_date = new Date(newTask.due_date);
            dispatch({
              type: "append-task",
              board_id: newTask.board_id,
              task: newTask,
            });
            removeToast(toastId);
          })
          .catch((err) =>
            updateToast(toastId, {
              type: "error",
              description: "Failed to create task " + err.message,
            })
          );
        break;
      }
      case "append-remove-task": {
        const toastId = addToast({ type: "info", name: "Move task" });
        let task_ids = state.boards
          .find((b) => b.board_id == action.board_id)
          ?.tasks.map((t: Task) => t.task_id)
          .filter((id: number) => id != action.task.task_id);
        task_ids?.splice(action.index, 0, action.task.task_id);
        console.warn("Saving task order (ids): " + task_ids);
        if (task_ids)
          backend
            .sortTasks(action.board_id, task_ids)
            .then((res) => removeToast(toastId))
            .catch((err) =>
              updateToast(toastId, {
                type: "error",
                description:
                  "Failed to move task. Please refresh page. Error:" +
                  err.message,
              })
            );
        dispatch(action);
        break;
      }
      case "remove-task": {
        const toastId = addToast({ name: "Delete task" });
        backend
          .deleteTask(action.task_id)
          .then((res) => removeToast(toastId))
          .catch((err) =>
            updateToast(toastId, {
              type: "error",
              description: "Failed to delete task. Error: " + err.message,
            })
          );
        dispatch(action);
        break;
      }
      default:
        dispatch(action);
    }
  };

  return (
    <>
      <div className="flex w-full my-2 gap-2">
        <h1 className="flex-grow text-2xl bold">Kanban board</h1>
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
      {visibleBoards.length ? (
        <BoardList
          user_id={user_id}
          list={state.boards}
          dispatch={dispatchBackend}
        />
      ) : hiddenBoards.length ? (
        <section className="space-y-2 bg-yellow-50 p-4 border border-yellow-600 rounded-md">
          <h2 className="text-xl font-medium text-yellow-800">
            All boards are hidden
          </h2>
          <p>
            Click the hidden boards button to list them and then click the board
            name to show it again.
          </p>
          <p>You can also click add board button to add new boards.</p>
        </section>
      ) : (
        <section className="space-y-2 bg-sky-50 p-4 border border-sky-600 rounded-md">
          <h2 className="text-xl font-medium text-sky-800">
            Welcome to Tehty kanban boards
          </h2>
          <p>You don&apos;t have any boards added yet.</p>
          <p>
            Start by creating some boards with &quot;Add board&quot; button. You
            can sort the boards with drag and drop.
          </p>
          <p>
            Then you can start adding tasks. Tasks can be dragged around to
            reorder them and to move them to other boards.
          </p>
          <p>
            Press the create example button below to create four boards and a
            few example tasks.
          </p>
          <AddExampleData dispatch={dispatch} />
        </section>
      )}
      <br />
      <Toaster />
    </>
  );
}
