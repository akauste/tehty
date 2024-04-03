import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import AddTaskButton from "../add-task-button";

const boards = [
  {
    board_id: 123,
    orderno: 0,
    user_id: "testsuite",
    name: "B1",
    background_color: "",
    show: true,
    show_done_tasks: true,
    tasks: [],
  },
];

describe("<AddBoardButton />", () => {
  afterEach(cleanup);

  test("show button", async () => {
    const dispatch = vi.fn();
    const { rerender } = render(
      <AddTaskButton visibleBoards={boards} dispatch={dispatch} />
    );
    const button = screen.getByRole("button");
    expect(button).toBeDefined();
  });

  test("show form & hide", async () => {
    const dispatch = vi.fn();
    const { rerender } = render(
      <AddTaskButton visibleBoards={boards} dispatch={dispatch} />
    );
    const button = screen.getByRole("button");
    expect(button).toBeDefined();

    fireEvent.click(button);
    const nameInput = await screen.findAllByRole("textbox");
    expect(nameInput.length).toBeGreaterThan(0);

    fireEvent.click(screen.getByTestId("backdrop"));
    expect(screen.queryAllByRole("textbox").length).toBe(0);
  });
});
