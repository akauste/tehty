'use client';
import { Todo, setTodoDone } from "@/lib/db";
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

interface ITodo {
  todo: Todo;
  remove: (id: Number) => void;
}

const TodoItem: React.FC<ITodo> = ({todo, remove}) => {
  const [t, setT] = useState(todo);
  
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

  return <li className={`${ t.done ? 'line-through text-gray-400' : 'text-bold' } flex flex-row w-full space-between my-2`}>
              <input className="flex" type="checkbox" checked={t.done} onChange={(e) => toggleDone()} />
              <span className="mx-2 grow">{ todo.task }</span>
              <button onClick={removeThis} aria-label="Remove" 
              className="mx p-1 border border-gray-700 rounded-sm text-xs bg-gray-200 text-gray-700 hover:text-gray-900 text-right"
                ><DeleteIcon /></button>
  </li>;
};
export default TodoItem;