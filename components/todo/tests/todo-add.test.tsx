import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import TodoAdd from "../todo-add";

describe("<TodoAdd ... />", () => {
  afterEach(cleanup);

  test("add", () => {
    const addTodo = vi.fn();
    render(<TodoAdd user_id="testsuite" addTodo={addTodo} />);

    const nameInput = screen.getByRole("textbox");
    expect(nameInput).toBeDefined();

    const addButton = screen.getByRole("button");
    expect(addButton).toBeDefined();

    fireEvent.change(nameInput, { target: { value: "first todo text" } });
    fireEvent.click(addButton);

    expect(addTodo).toBeCalledTimes(1);
    expect(addTodo.mock.calls[0][0]).toBe("first todo text");
  });

  test("add with enter", () => {
    const addTodo = vi.fn();
    render(<TodoAdd user_id="testsuite" addTodo={addTodo} />);

    const nameInput = screen.getByRole("textbox");
    expect(nameInput).toBeDefined();

    fireEvent.change(nameInput, { target: { value: "first todo text" } });
    fireEvent.submit(nameInput);

    expect(addTodo).toBeCalledTimes(1);
    expect(addTodo.mock.calls[0][0]).toBe("first todo text");
  });
});
