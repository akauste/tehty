'use client';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoList from "./todo-list";
import { Todo } from "@/lib/db";

export default function Todoer({user_id, todos}: {user_id: string, todos: Todo[]}) {
  return <DndProvider backend={HTML5Backend}>
    <TodoList user_id={user_id} list={todos} />
  </DndProvider>
}