"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardList from "./board-list";
import { BoardTask } from "@/lib/db";
import { useReducer, useState } from "react";
import { Board, Task } from "@/lib/db";
import AddBoardButton from "./add-board-button";
import HiddenBoards from "./hidden-boards";
import AddTaskModal from "../task/add-task-modal";
import { kanbanReducer } from "@/lib/kanban-reducer";

export default function Kanban({
  user_id,
  boards,
}: {
  user_id: string;
  boards: BoardTask[];
}) {
  const [state, dispatch] = useReducer(kanbanReducer, { boards });

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
      </div>
      <BoardList user_id={user_id} list={state.boards} dispatch={dispatch} />
      <br />
    </DndProvider>
  );
}
