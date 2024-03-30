import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import TodoItem from "../todo-item";
import { Todo } from "@/lib/db";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

describe("<TodoItem ... />", () => {
  afterEach(cleanup);

  test("display", () => {
    const todo: Todo = {
      todo_id: 123,
      orderno: 0,
      user_id: "testsuite",
      task: "My first task",
      done: false,
    };
    const remove = vi.fn();
    const moveTodo = vi.fn();
    const findTodo = (id: string) => ({ index: 0 });
    const onDrop = vi.fn();

    render(
      <DndProvider backend={HTML5Backend}>
        <TodoItem
          todo={todo}
          remove={remove}
          moveTodo={moveTodo}
          findTodo={findTodo}
          onDrop={onDrop}
        />
      </DndProvider>
    );
    expect(screen.getByRole("checkbox")).toBeDefined();
    expect(screen.getByRole("checkbox", { checked: false })).toBeDefined();
    expect(screen.getByText("My first task")).toBeDefined();
    const deleteButton = screen.getByRole("button");
    expect(deleteButton).toBeDefined();

    fireEvent.click(deleteButton);
    expect(remove).toBeCalledTimes(1);
  });
});
