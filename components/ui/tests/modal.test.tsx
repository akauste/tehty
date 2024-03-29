import { cleanup, screen, render, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Modal from "../modal";

//   modal.tsx                         |      35 |      100 |       0 |      35 | 7-19

describe("<Modal ... />", () => {
  afterEach(cleanup);

  test("create modal", () => {
    const close = vi.fn();
    render(<Modal close={close}>Content text here</Modal>);

    const modal = screen.getByTestId("modal");
    expect(modal).toBeDefined();
    expect(modal.textContent).toBe("Content text here");
  });

  test("backdrop close works", () => {
    const close = vi.fn();
    render(<Modal close={close}>Content text here</Modal>);

    // Check that both elements exist:
    const backdrop = screen.getByTestId("backdrop");
    expect(backdrop).toBeDefined();
    const modal = screen.getByTestId("modal");
    expect(modal).toBeDefined();

    // Check that clicking modal does not leak to backdrop
    fireEvent.click(modal);
    expect(close).toBeCalledTimes(0);

    // Maku sure clicking backdrop closes the modal
    fireEvent.click(backdrop);
    expect(close).toBeCalledTimes(1);
  });
});
