"use client";
import { NewTodo, Todo } from "@/lib/db";
import TodoItem from "./todo-item";
import TodoAdd from "./todo-add";
import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";

const addTodo = async (todo: NewTodo): Promise<Todo> => {
  const data = await fetch("/api/todos", {
    method: "POST",
    body: JSON.stringify(todo),
  });
  return await data.json();
};

const deleteTodo = async (todo_id: Number): Promise<Todo> => {
  const data = await fetch("/api/todos/" + todo_id, {
    method: "DELETE",
  });
  return await data.json();
};

const TodoList: React.FC<{ user_id: string; list: Todo[] }> = ({
  user_id,
  list,
}) => {
  const [todos, setTodos] = useState<Todo[]>(list);

  const insertTodo = (task: string) => {
    addTodo({ task, user_id, done: false, orderno: null }).then((newTodo) =>
      setTodos((old) => [...old, newTodo])
    );
  };

  const removeTodo = (id: Number) => {
    console.log("removing todo item: ", id);
    deleteTodo(id).then(() =>
      setTodos((old) => old.filter((i) => i.todo_id != id))
    );
  };

  const findTodo = useCallback(
    (id: string) => {
      const todo = todos.filter((t) => `${t.todo_id}` === id)[0];
      return {
        todo,
        index: todos.indexOf(todo),
      };
    },
    [todos]
  );

  const moveTodo = useCallback(
    (id: string, atIndex: number) => {
      const { todo, index } = findTodo(id);
      setTodos((old) => {
        const list = [...old];
        list.splice(index, 1);
        list.splice(atIndex, 0, todo);
        return list;
      });
    },
    [findTodo, setTodos]
  );

  const updateOrder = async () => {
    const res = await fetch("/api/todos", {
      method: "PATCH",
      body: JSON.stringify(
        todos.map((t, index) => ({ todo_id: t.todo_id, orderno: index }))
      ),
    });
    const data = await res.json();
    console.log("Updated: ", data);
  };

  const [, drop] = useDrop(() => ({ accept: "todo" }));

  return (
    <>
      <ul className="my-8 w-full" ref={drop}>
        {todos.map((t, i) => (
          <TodoItem
            key={i}
            todo={t}
            remove={removeTodo}
            moveTodo={moveTodo}
            findTodo={findTodo}
            onDrop={updateOrder}
          />
        ))}
      </ul>
      <TodoAdd user_id={user_id} addTodo={insertTodo} />
    </>
  );
};
export default TodoList;
