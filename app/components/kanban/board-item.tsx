'use client';
import { Todo, setTodoDone } from "@/lib/db";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag, useDrop } from "react-dnd";
import { Board, Task } from "./board-list";
import { Edit, Add, EditTwoTone, Settings, DragHandle, DragHandleOutlined, DragHandleTwoTone, Details, DetailsTwoTone, OpenInFull, Assignment } from '@mui/icons-material';
import BoardEdit from "./board-edit";
import TaskList from "../task/task-list";

interface IBoard {
  board: Board;
  update: (board: Board) => void;
  remove: (id: Number) => void;
  moveBoard: (id: string, to: number) => void;
  findBoard: (id: string) => { index: number };
  onDrop: () => void;
}

export const bgColors = [
  '#94a3b8', // slate-400
  '#f87171', // red-400
  '#fbbf24', // amber-400
  '#a3e635', // lime-400
  '#34d399', // emerald-400
  '#22d3ee', // cyan-400
  '#60a5fa', // blue-400
  '#a78bfa', // violet-400
  '#e879f9', // fuchsia-400
  '#fb7185', // rose-400
];

const BoardItem: React.FC<IBoard> = ({board, update, remove, moveBoard, findBoard, onDrop}) => {
  //const [b, setB] = useState(board);
  const [boardEdit, setBoardEdit] = useState(false);
  const toggleBoardEdit = () => setBoardEdit(v => !v);
  const bgColor = board.backgroundColor;

  /*useEffect(() => {
    update(board);
  }, [board])*/
  
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

  const originalIndex = findBoard(board.board_id.toString()).index;
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'board',
      item: { id: board.board_id.toString(), originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        //console.log(droppedId, originalIndex);
        const didDrop = monitor.didDrop()
        if (!didDrop) {
          moveBoard(droppedId, originalIndex)
        }
        else {
          onDrop();
        }
      },
    }),
    [originalIndex, moveBoard],
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'board',
      hover({ id: draggedId }: Board & {id: string}) {
        if (draggedId !== board.board_id.toString()) {
          const { index: overIndex } = findBoard(board.board_id.toString())
          moveBoard(draggedId.toString(), overIndex)
        }
      },
      // drop(item) {
      //   console.log('DROP HAPPENED', item);
      // }
    }),
    [findBoard, moveBoard],
  )

  return <li ref={(node) => drag(drop(node))} 
    className="bg-slate-200 dark:bg-slate-700 flex-1 flex-grow min-h-96 border border-slate-500 shadow-sm shadow-slate-500 space-y-2">
      <header className="flex border-b border-slate-400 p-1" style={{ 
          backgroundImage: `linear-gradient(to right, ${bgColor} 40%, transparent)` 
        }}>
        <h2 className={`flex-grow flex-shrink`}>{ board.name }</h2>
        <button onClick={toggleBoardEdit} className="hover:text-sky-800 dark:hover:text-sky-200"><Edit fontSize="small" /><span className="sr-only">edit</span></button>
        { boardEdit && <BoardEdit board={board} update={update} close={() => setBoardEdit(false)} /> }
      </header>
      <TaskList user_id={'testuser'} list={board.tasks} />
      <button className="mt-2 hover:text-sky-800 dark:hover:text-sky-200"><Add fontSize="small" /> Add</button>
  </li>;
};
export default BoardItem;