'use client';
import { Todo, setTodoDone } from "@/lib/db";
import { useState } from "react";

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

  return <li className={`${ t.done ? 'line-through text-gray-400' : 'text-bold' }`}>
              <input type="checkbox" checked={t.done} onChange={(e) => toggleDone()} />
              { todo.task }
              <button onClick={removeThis}>Remove</button>
  </li>;
};
export default TodoItem;