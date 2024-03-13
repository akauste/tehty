"use client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardList from "./board-list";
import { BoardTask, Todo, userBoards } from "@/lib/db";
import { useReducer, useState } from "react";
import { produce } from "immer";
import { Board, Task } from "@/lib/db";
import BoardEdit from "./board-edit";
import AddBoardButton from "./add-board-button";
import HiddenBoards from "./hidden-boards";
import AddTaskModal from "../task/add-task-modal";

const tasks: Task[] = [
  {
    task_id: 1,
    board_id: 1,
    name: "Task 1 (lime)",
    description:
      "Description of the first task. Long description to test the clamping when we go on for too long",
    background_color: "#a3e635",
    tags: ["#tag1"],
    due_date: new Date(),
    done: false,
    orderno: 1,
    user_id: "testuser",
  },
  {
    task_id: 2,
    board_id: 1,
    name: "Task 2 (red)",
    description: "This one is important",
    background_color: "#f87171",
    tags: ["#tag1", "#important", "#tagged"],
    due_date: new Date("2000-01-01"),
    done: false,
    orderno: 2,
    user_id: "testuser",
  },
  {
    task_id: 3,
    board_id: 2,
    name: "Task 3",
    description: "",
    background_color: "",
    tags: [],
    due_date: new Date("2024-03-13"),
    done: false,
    orderno: 2,
    user_id: "testuser",
  },
  {
    task_id: 4,
    board_id: 2,
    name: "Task 4",
    description: "",
    background_color: "",
    tags: [],
    due_date: null, // new Date("13.3.2024"),
    done: false,
    orderno: 2,
    user_id: "testuser",
  },
];
const t2 = [
  {
    task_id: 5,
    board_id: 3,
    name: "Task 5",
    description: "",
    background_color: "",
    tags: [],
  },
  {
    task_id: 6,
    board_id: 1,
    name: "Task 6",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 7,
    board_id: 4,
    name: "Task 7",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 8,
    board_id: 1,
    name: "Task 8",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 9,
    board_id: 2,
    name: "Task 9",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 10,
    board_id: 3,
    name: "Task 10",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 11,
    board_id: 4,
    name: "Task 11",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 12,
    board_id: 4,
    name: "Task 12",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 13,
    board_id: 2,
    name: "Task 13",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 14,
    board_id: 3,
    name: "Task 14",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 15,
    board_id: 1,
    name: "Task 15",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 16,
    board_id: 4,
    name: "Task 16",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 17,
    board_id: 4,
    name: "Task 17",
    description: "",
    backgroundColor: "",
    tags: [],
  },
  {
    task_id: 18,
    board_id: 4,
    name: "Task 18",
    description: "",
    backgroundColor: "",
    tags: [],
  },
];

const boards__ = [
  {
    board_id: 1,
    backgroundColor: "#94a3b8",
    name: "Planned",
    orderno: 1,
    user_id: "testuser",
    show: true,
    showDoneTasks: true,
    tasks: tasks.filter((t) => t.board_id === 1),
  },
  {
    board_id: 2,
    backgroundColor: "#60a5fa",
    name: "In progress",
    orderno: 2,
    user_id: "testuser",
    show: true,
    showDoneTasks: true,
    tasks: tasks.filter((t) => t.board_id === 2),
  },
  {
    board_id: 3,
    backgroundColor: "#fbbf24",
    name: "In testing",
    orderno: 3,
    user_id: "testuser",
    show: true,
    showDoneTasks: true,
    tasks: tasks.filter((t) => t.board_id === 3),
  },
  {
    board_id: 4,
    backgroundColor: "#a3e635",
    name: "Done",
    orderno: 4,
    user_id: "testuser",
    show: true,
    showDoneTasks: true,
    tasks: tasks.filter((t) => t.board_id === 4),
  },
];

const boardsOk: Board[] = [];

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

function reducer(state: { boards: Board[] }, action: KanbanActions) {
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
  return state;
}

export default function Kanban({
  user_id,
  boards,
}: {
  user_id: string;
  boards: BoardTask[];
}) {
  //{user_id, todos}: {user_id: string, todos: Todo[]}
  const [state, dispatch] = useReducer(reducer, { boards });

  const hiddenBoards = state.boards.filter((b) => !b.show);
  const visibleBoards = state.boards.filter((b) => b.show);

  const [showAddTask, setShowAddTask] = useState(false);

  const addTask = (task: Task) => {
    console.log("addTask", task);
    dispatch({ type: "append-task", board_id: task.board_id, task });
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
