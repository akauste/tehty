import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, test, vi } from "vitest";
import Todoer from "../Todoer";
import { expect } from "vitest";
import { Todo } from "@/lib/db";

const createTodos = () => {
  return [
    {
      todo_id: 32,
      task: "First task",
      orderno: 0,
      user_id: "testsuite",
      done: false,
    },
    {
      todo_id: 666,
      task: "Done deal",
      orderno: 1,
      user_id: "testsuite",
      done: true,
    },
    {
      todo_id: 42,
      task: "Other item",
      orderno: 2,
      user_id: "testsuite",
      done: false,
    },
  ];
};

describe("<Todoer ... />", () => {
  let originalFetch: any;
  let fetchResponse: any;

  const mockedResponse = (
    input: URL | RequestInfo,
    init?: RequestInit | undefined
  ): Promise<any> =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return Promise.resolve(fetchResponse);
      },
    });

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterEach(cleanup);
  afterAll(() => {
    global.fetch = originalFetch;
  });

  test("display empty", () => {
    render(<Todoer user_id="testsuite" todos={[]} />);
    expect(screen.queryAllByRole("listitem").length).toBe(0);
  });

  test("display empty + insert first", async () => {
    render(<Todoer user_id="testsuite" todos={[]} />);
    const addInput = screen.getByRole("textbox");

    fetchResponse = { todo_id: 54, task: "Test task", done: false, orderno: 0 };
    const mockedFetch = vi.fn(mockedResponse);
    global.fetch = mockedFetch;

    fireEvent.change(addInput, { target: { value: "Test task" } });
    fireEvent.submit(addInput);

    // Wait for new element to appear:
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBe(1);
    expect(mockedFetch).toBeCalledTimes(1);
  });

  test("delete middle one", async () => {
    const todos = createTodos();
    render(<Todoer user_id="testsuite" todos={todos} />);

    fetchResponse = { removed: todos[1].todo_id };
    const mockedFetch = vi.fn(mockedResponse);
    global.fetch = mockedFetch;

    const deleteButtons = screen.getAllByLabelText("Remove");
    expect(deleteButtons.length).toBe(3); // 3 rows
    fireEvent.click(deleteButtons[1]);

    expect(mockedFetch).toBeCalledTimes(1);
    expect(mockedFetch.mock.calls[0][0]).toBe("/api/todos/" + todos[1].todo_id);
    expect(mockedFetch.mock.calls[0][1]?.method).toBe("DELETE");

    // Wait for new element to appear:
    await waitForElementToBeRemoved(() => screen.queryByText(todos[1].task));
    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBe(2);
  });

  test("with three tasks", () => {
    const todos: Todo[] = createTodos();

    render(<Todoer user_id="testsuite" todos={todos} />);
    expect(screen.getAllByRole("listitem").length).toBe(3);

    const listItems = screen.getAllByRole("listitem");
    // Remember original texts:
    const origText = screen.getAllByRole("listitem").map((i) => i.textContent);

    // We don't care about fetch response, when updating order
    fetchResponse = {};
    const mockedFetch = vi.fn(mockedResponse);
    global.fetch = mockedFetch;

    // Drag 3. item to 1. and drop
    fireEvent.dragStart(listItems[2]);
    fireEvent.dragEnter(listItems[0]);
    fireEvent.dragOver(listItems[0]);
    fireEvent.drop(listItems[0]);

    expect(global.fetch).toBeCalledTimes(1);
    // expect(mockedFetch.mock.calls[0][1]?.body).toBe(
    //   JSON.stringify({ todo_ids: [42, 32, 666] })
    // );

    // Check that positions moved to right order:
    expect(screen.getAllByRole("listitem")[0].textContent).toBe(origText[2]);
    expect(screen.getAllByRole("listitem")[1].textContent).toBe(origText[0]);
    expect(screen.getAllByRole("listitem")[2].textContent).toBe(origText[1]);
  });

  test("drag and drop to non drop target", () => {
    const todos: Todo[] = createTodos();

    render(<Todoer user_id="testsuite" todos={todos} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(3);
    // Remember original texts:
    const origText = screen.getAllByRole("listitem").map((i) => i.textContent);

    // We don't care about fetch response, when updating order
    fetchResponse = {};
    const mockedFetch = vi.fn(mockedResponse);
    global.fetch = mockedFetch;

    // Drag 2. item to 4. (which is the add new row & not a drop target)
    fireEvent.dragStart(listItems[1]);
    fireEvent.dragEnter(listItems[2]);
    fireEvent.dragOver(listItems[2]);
    const addForm = screen.getByTestId("addform");
    fireEvent.dragEnter(addForm);
    fireEvent.dragOver(addForm);
    fireEvent.drop(addForm);

    // Check that positions stayed the same:
    expect(screen.getAllByRole("listitem")[0].textContent).toBe(origText[0]);
    expect(screen.getAllByRole("listitem")[1].textContent).toBe(origText[1]);
    expect(screen.getAllByRole("listitem")[2].textContent).toBe(origText[2]);

    // No change => no fetch call
    expect(global.fetch).toBeCalledTimes(0);
  });

  test("click done", () => {
    const todos: Todo[] = createTodos();

    fetchResponse = { ...todos[0], done: true };
    const mockedFetch = vi.fn(mockedResponse);
    global.fetch = mockedFetch;

    render(<Todoer user_id="testsuite" todos={todos} />);
    fireEvent.click(screen.getAllByRole("checkbox")[0]);

    expect(mockedFetch).toBeCalledTimes(1);
    const call = mockedFetch.mock.calls[0];
    expect(call[0]).toBe("/api/todos/" + todos[0].todo_id);
    expect(call[1]?.method).toBe("PATCH");
  });
});
