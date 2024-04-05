import { describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import HiddenBoards from "../hidden-boards";
import { afterEach } from "node:test";
import { Board } from "@/lib/types";

const dispatch = vi.fn();

describe("<HiddenBoards />", () => {
  afterEach(cleanup);

  test("no hidden boards", () => {
    render(<HiddenBoards hiddenBoards={[]} dispatch={dispatch} />);

    expect(
      screen.getByRole("button", { name: "0 hidden boards" })
    ).toBeDefined();
  });

  test("1 hidden board", () => {
    const boards: Board[] = [
      {
        board_id: 42,
        orderno: 0,
        user_id: "testsuite",
        name: "To be hidden",
        background_color: "blue",
        show: false,
        show_done_tasks: false,
        tasks: [],
      },
    ];
    render(<HiddenBoards hiddenBoards={boards} dispatch={dispatch} />);

    const button = screen.getByRole("button", { name: "1 hidden boards" });

    expect(button).toBeDefined();
    // List not shown:
    expect(screen.queryByRole("button", { name: "To be hidden" })).toBe(null);

    // List to be shown after button click:
    fireEvent.click(button);
    const boardButton = screen.getByRole("button", { name: "To be hidden" });
    expect(boardButton).toBeDefined();

    // Click button to call dispatch:
    fireEvent.click(boardButton);
    expect(dispatch).toBeCalledTimes(1);
    expect(dispatch.mock.calls[0][0].type).toBe("update-board");
  });
});
