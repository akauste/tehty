"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardList from "./board-list";
import { BoardTask } from "@/lib/db";
import { Dispatch, useEffect, useReducer, useState } from "react";
import { Board, Task } from "@/lib/db";
import AddBoardButton from "./add-board-button";
import HiddenBoards from "./hidden-boards";
import AddTaskModal from "../task/add-task-modal";
import { KanbanActions, kanbanReducer } from "@/lib/kanban-reducer";
import { CheckCircleOutline, Sync, Update } from "@mui/icons-material";

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

  const hiddenBoards = state.boards.filter((b) => !b.show);
  const visibleBoards = state.boards.filter((b) => b.show);

  const [showAddTask, setShowAddTask] = useState(false);

  const addTask = async (task: Partial<Task>) => {
    console.log("addTask", task);
    fetch("/api/task", {
      method: "POST",
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((newTask) =>
        dispatch({
          type: "append-task",
          board_id: newTask.board_id,
          task: newTask,
        })
      );
    setShowAddTask(false);
  };

  console.log("STATE", state);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex w-full my-2 gap-2">
        <h1 className="flex-grow">Kanban test</h1>
        {hiddenBoards.length > 0 && (
          <HiddenBoards hiddenBoards={hiddenBoards} dispatch={dispatch} />
        )}
        <button className=" px-1 border border-slate-500 rounded hover:bg-slate-200 hover:text-sky-800">
          Action
        </button>
        <button className=" px-1 border border-slate-500 rounded hover:bg-slate-200 hover:text-sky-800">
          Other
        </button>
        {visibleBoards.length > 0 && (
          <button
            className=" px-1 border border-slate-500 rounded hover:bg-slate-200 hover:text-sky-800"
            onClick={() => setShowAddTask((s) => !s)}
          >
            + Add task
          </button>
        )}
        {showAddTask ? (
          <AddTaskModal
            boards={visibleBoards}
            task={{}}
            save={addTask}
            close={() => setShowAddTask(false)}
          />
        ) : null}
        <AddBoardButton user_id={user_id} dispatch={dispatch} />
        <SyncSorting
          unSyncedActions={state.unSyncedActions}
          dispatch={dispatch}
        />
      </div>
      <BoardList user_id={user_id} list={state.boards} dispatch={dispatch} />
      <br />
    </DndProvider>
  );
}

const clearer = async (
  unSyncedActions: any,
  dispatch: Dispatch<KanbanActions>,
  setSyncing: Dispatch<boolean>
) => {
  setSyncing(true);
  const actions = [...unSyncedActions];
  console.log("CUT:", actions.length);
  dispatch({ type: "clear-unsynced", cutLength: actions.length });
  fetch("/api/kanban/sync", { method: "POST", body: JSON.stringify(actions) })
    .then((res) => res.json())
    .then((data) => {
      console.info("Synced:", data);
      setSyncing(false);
    })
    .catch((err: any) => {
      console.error("Failed to sync: ", err);
    });
  console.log("SEND actions to db");
};

const SyncSorting = ({
  unSyncedActions,
  dispatch,
}: {
  unSyncedActions: any[];
  dispatch: Dispatch<KanbanActions>;
}) => {
  const [isSyncing, setSyncing] = useState(false);

  useEffect(() => {
    if (unSyncedActions.length) {
      const timer = setTimeout(
        () => clearer(unSyncedActions, dispatch, setSyncing),
        3000 // 3 sec debouncing time
      );
      return () => clearTimeout(timer);
    }
  }, [unSyncedActions, dispatch]);
  return (
    <div>
      {isSyncing ? (
        <Sync fontSize="small" className="animate-spin text-green-500" />
      ) : unSyncedActions.length == 0 ? (
        <CheckCircleOutline fontSize="small" className="text-green-500" />
      ) : (
        <Update fontSize="small" className="text-orange-500" />
      )}
    </div>
  );
};
