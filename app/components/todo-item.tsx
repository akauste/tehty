'use client';
import { Todo, setTodoDone } from "@/lib/db";
import { useState } from "react";

interface ITodo {
  todo: Todo
}

const TodoItem: React.FC<ITodo> = ({todo}) => {
  const [t, setT] = useState(todo);
  
  const toggleDone = () => {
    fetch('/api/todo', {
      method: 'PATCH',
      
      body: JSON.stringify( t )
    });
    setT(old => ({...old, done: !old.done}));
  }

  return <li className={`${ t.done ? 'line-through text-gray-400' : 'text-bold' }`}>
              <input type="checkbox" checked={t.done} onChange={(e) => toggleDone()} />
              { todo.task }
  </li>;
};
export default TodoItem;