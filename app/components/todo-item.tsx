'use client';
import { Todo, setTodoDone } from "@/lib/db";
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDrag, useDrop } from "react-dnd";

interface ITodo {
  todo: Todo;
  remove: (id: Number) => void;
  moveTodo: (id: string, to: number) => void;
  findTodo: (id: string) => { index: number };
}

const TodoItem: React.FC<ITodo> = ({todo, remove, moveTodo, findTodo}) => {
  const [t, setT] = useState(todo);

  useEffect(() => {
    setT(todo);
  }, [todo])
  
  const toggleDone = () => {
    fetch('/api/todo', {
      method: 'PATCH',
      
      body: JSON.stringify( t )
    });
    setT(old => ({...old, done: !old.done}));
  }

  const removeThis = () => {
    remove(todo.todo_id)
  }

  const originalIndex = findTodo(todo.todo_id.toString()).index;
  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: 'todo',
      item: { id: todo.todo_id.toString(), originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        console.log(droppedId, originalIndex);
        const didDrop = monitor.didDrop()
        if (!didDrop) {
          moveTodo(droppedId, originalIndex)
        }
      },
    }),
    [originalIndex, moveTodo],
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'todo',
      hover({ id: draggedId }: Todo & {id: string}) {
        if (draggedId !== todo.todo_id.toString()) {
          const { index: overIndex } = findTodo(todo.todo_id.toString())
          moveTodo(draggedId.toString(), overIndex)
        }
      },
    }),
    [findTodo, moveTodo],
  )

  return <li ref={(node) => drag(drop(node))} 
    className={`flex flex-row w-full space-between my-2`}>
      <input className="flex m-2" type="checkbox" checked={t.done} onChange={(e) => toggleDone()} />
      <span className={`${ t.done ? 'line-through text-gray-400' : 'text-bold' } mx-2 grow`}>{ todo.task }</span>
      <button onClick={removeThis} aria-label="Remove" 
          className="mx p-1 border border-gray-700 rounded-sm text-xs bg-gray-200 text-gray-700 hover:text-gray-900 text-right">
          <DeleteIcon />
      </button>
  </li>;
};
export default TodoItem;