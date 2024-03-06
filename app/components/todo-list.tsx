'use client';
import { NewTodo, Todo } from "@/lib/db";
import TodoItem from "./todo-item";
import TodoAdd from "./todo-add";
import { useEffect, useState } from "react";

const getTodos = async () : Promise<Todo[]> => {
  const data = await fetch('/api/todos');
  const list : Todo[] = await data.json();
  return list;
}

const addTodo = async (todo: NewTodo) : Promise<Todo> => {
  const data = await fetch('/api/todo', {
    method: 'POST',
    body: JSON.stringify(todo),
  });
  return await data.json();
}

const deleteTodo = async (todo_id: Number) : Promise<Todo> => {
  const data = await fetch('/api/todo', {
    method: 'DELETE',
    body: JSON.stringify({todo_id}),
  });
  return await data.json();
}

const TodoList : React.FC<{user_id: string}> = ({user_id}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  
  useEffect(() => {
    getTodos().then(list => setTodos(list));
  }, []);

  const insertTodo = (task: string) => {
    addTodo({ task, user_id, done: false, orderno: null}).then(newTodo => setTodos(old => [...old, newTodo]));
  }

  const removeTodo = (id: Number) => {
    console.log('removing todo item: ', id);
    deleteTodo(id).then(() => setTodos(old => old.filter(i => i.todo_id != id)));
  }

  return <ul className="my-8 w-full">
    { todos.map((t, i) => <TodoItem key={i} todo={t} remove={removeTodo} />) }
    <TodoAdd user_id={user_id} addTodo={insertTodo} />
  </ul>
}
export default TodoList;