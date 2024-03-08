'use client';
import { Todo, setTodoDone } from "@/lib/db";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag, useDrop } from "react-dnd";
import { Board } from "./board-list";

interface IBoard {
  board: Board;
  remove: (id: Number) => void;
  moveBoard: (id: string, to: number) => void;
  findBoard: (id: string) => { index: number };
  onDrop: () => void;
}

const BoardItem: React.FC<IBoard> = ({board, remove, moveBoard, findBoard, onDrop}) => {
  const [b, setB] = useState(board);

  useEffect(() => {
    setB(board);
  }, [board])
  
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

  const [boardEdit, setBoardEdit] = useState(false);
  const toggleBoardEdit = () => setBoardEdit(v => !v);

  return <li ref={(node) => drag(drop(node))} 
    className=" background-slate-200 flex-grow h-96 border border-slate-500 shadow-sm shadow-slate-500">
      <header className="flex border-b border-slate-400 p-1" style={{ backgroundColor: b.backgroundColor }}>
        <h2 className={`flex-grow flex-shrink`}>{ b.name }</h2>
        <button onClick={toggleBoardEdit}>edit</button>
        { boardEdit && 
          <div className="absolute bg-slate-100 dark:bg-slate-700 p-2 flex flex-col space-y-2">
            <label>Name</label>
            <input type="text" value={b.name} onChange={(e) => setB(o => ({...o, name: e.target.value}))} className="border border-slate-500 rounded" /> 
            <label>Color</label>
            <select className="border border-slate-500 rounded">
              <option>Default</option>
            </select> 
            <label>
              <input type="checkbox" />
              Show</label>
            <button className="border border-slate-500 rounded p-1" onClick={toggleBoardEdit}>Close</button>
          </div>
        }
      </header>
      <ul className="space-y-2">
        <li className="bg-slate-400">
          Item 1
          <p className="text-xs line-clamp-3">The longer description of this task, that might be really really long. If you type too much then we clamp it to a shorter form.</p>
        </li>
        <li className="bg-red-400 border-b border-red-600 shadow-sm shadow-red-700">Item 2</li>
        <li className="bg-slate-400 border-green-600 shadow-sm shadow-green-700">
          <h3 className="px-1 bg-green-400 bold">Item 3</h3>
          <p className="p-1 text-xs text-green-900 line-clamp-3">Some other info here</p>
        </li>
        <li className="bg-slate-400">Item 4</li>
      </ul>
      <button>+ Add</button>
  </li>;
};
export default BoardItem;