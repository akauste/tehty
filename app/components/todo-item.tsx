'use client';
import { setTodoDone } from "@/lib/db";
import { useState } from "react";

interface ITodo {
  todo: {
    todo_id: Number;
    user_id: string;
    orderno: number;
    task: string;
    done: boolean;
  }
}

const TodoItem: React.FC<ITodo> = ({todo}) => {
  const [t, setT] = useState(todo);
  
  const toggleDone = () => {
    //setTodoDone(t.todo_id, !t.done);
    fetch('/api/todo', {
      method: 'POST',
      
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