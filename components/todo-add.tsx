'use client';
import { FormEvent, useState } from "react";

const TodoAdd: React.FC<{user_id: string, addTodo: (task: string) => void}> = ({user_id, addTodo}) => {
  const [ task, setTask ] = useState('');
  const submit = (e: FormEvent) => {
    e.preventDefault();
    addTodo(task);
    setTask('');
  }
  return <li>
      <form onSubmit={submit} className="flex flex-row">
        <input placeholder="New task" value={task} onChange={(e) => setTask(e.currentTarget.value)}
          className="w-full border rounded flex-grow border-r-0 rounded-r-none p-1" />
        <button type="submit" className="border rounded rounded-l-none p-1 bg-blue-300 text-xs">Add</button>
      </form>
    </li>
}
export default TodoAdd;