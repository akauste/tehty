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
      <form onSubmit={submit}>
        <input placeholder="New task" value={task} onChange={(e) => setTask(e.currentTarget.value)} />
      </form>
    </li>
}
export default TodoAdd;