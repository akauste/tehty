"use client";
import { Todo, setTodoDone } from "@/lib/db";
import { Dispatch, PropsWithChildren, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDrag, useDrop } from "react-dnd";
//import { Board, Task } from "./board-list";
import { Board, Task } from "@/lib/db";
import {
  Edit,
  Add,
  EditTwoTone,
  Settings,
  DragHandle,
  DragHandleOutlined,
  DragHandleTwoTone,
  Details,
  DetailsTwoTone,
  OpenInFull,
  Assignment,
  More,
  MoreVert,
  Delete,
  DeleteOutline,
  VisibilityOff,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import BoardEditor from "./board-editor";
import TaskList from "../task/task-list";
import { KanbanActions } from "@/lib/kanban-reducer";
import DropdownMenu from "../ui/dropdown-menu";
import MenuItem from "../ui/menuitem";

interface IBoard {
  board: Board;
  update: (board: Board) => void;
  remove: (id: number) => void;
  moveBoard: (id: number, to: number) => void;
  findBoard: (id: number) => { index: number };
  onDrop: () => void;
  dispatch: Dispatch<KanbanActions>;
}

export const bgColors = [
  "#94a3b8", // slate-400
  "#f87171", // red-400
  "#fbbf24", // amber-400
  "#a3e635", // lime-400
  "#34d399", // emerald-400
  "#22d3ee", // cyan-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#e879f9", // fuchsia-400
  "#fb7185", // rose-400
];

const BoardItem: React.FC<IBoard> = ({
  board,
  update,
  remove,
  moveBoard,
  findBoard,
  onDrop,
  dispatch,
}) => {
  const [boardEdit, setBoardEdit] = useState(false);
  const toggleBoardEdit = () => setBoardEdit((v) => !v);

  const bgColor = board.background_color;

  // const toggleDone = () => {
  //   fetch('/api/todo', {
  //     method: 'PATCH',

  //     body: JSON.stringify( t )
  //   });
  //   setT(old => ({...old, done: !old.done}));
  // }

  // const removeThis = () => {
  //   remove(todo.todo_id)
  // }

  const originalIndex = findBoard(board.board_id).index;
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "board",
      item: { id: board.board_id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveBoard(droppedId, originalIndex);
        } else {
          onDrop();
        }
      },
    }),
    [originalIndex, moveBoard]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "board",
      hover({ id: draggedId }: Board & { id: number }) {
        if (draggedId !== board.board_id) {
          const { index: overIndex } = findBoard(board.board_id);
          moveBoard(draggedId, overIndex);
        }
      },
    }),
    [findBoard, moveBoard]
  );

  const deleteHandler = () => {
    dispatch({
      type: "delete-board",
      board_id: board.board_id,
    });
  };

  return (
    <li
      ref={(node) => drag(drop(node))}
      className="bg-slate-200 dark:bg-slate-700 flex-1 flex-grow min-h-96 border border-slate-500 shadow-sm shadow-slate-500 space-y-2 flex flex-col"
    >
      <header
        className="flex border-b border-slate-400 p-1"
        style={{
          backgroundImage: `linear-gradient(to right, ${bgColor} 40%, transparent)`,
        }}
      >
        <h2 className={`flex-grow flex-shrink`}>{board.name}</h2>
        <button
          onClick={() => {
            setBoardEdit(true);
          }}
          className="hover:text-sky-800 dark:hover:text-sky-200"
        >
          <Edit fontSize="small" />
          <span className="sr-only">edit</span>
        </button>
        <DropdownMenu>
          <MenuItem
            onClick={() => {
              toggleBoardEdit();
            }}
          >
            <Edit fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem disabled={board.tasks.length > 0} onClick={deleteHandler}>
            <DeleteOutline fontSize="small" /> Delete
          </MenuItem>
          <MenuItem
            onClick={() => {
              dispatch({
                type: "update-board",
                board: { ...board, show: false },
              });
            }}
          >
            <VisibilityOffOutlined fontSize="small" /> Hide
          </MenuItem>
          {board.show_done_tasks ? (
            <MenuItem
              onClick={() => {
                dispatch({
                  type: "update-board",
                  board: { ...board, show_done_tasks: false },
                });
              }}
            >
              <VisibilityOffOutlined fontSize="small" /> Hide done tasks
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() => {
                dispatch({
                  type: "update-board",
                  board: { ...board, show_done_tasks: true },
                });
              }}
            >
              <VisibilityOutlined fontSize="small" /> Show done tasks
            </MenuItem>
          )}
        </DropdownMenu>
        {boardEdit && (
          <BoardEditor
            board={board}
            save={(board: Board) => dispatch({ type: "update-board", board })}
            close={() => setBoardEdit(false)}
          />
        )}
      </header>
      <TaskList
        user_id={"testuser"}
        board_id={board.board_id}
        show_done_tasks={board.show_done_tasks}
        list={board.tasks}
        dispatch={dispatch}
      />
    </li>
  );
};
export default BoardItem;
