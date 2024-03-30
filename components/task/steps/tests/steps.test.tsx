import { cleanup, screen, render, fireEvent } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import Steps, { Step } from "../steps";
import { Dispatch, SetStateAction } from "react";

describe("<Steps ... />", () => {
  afterEach(cleanup);

  test("create empty steps", async () => {
    let steps: Step[] = [];
    const setSteps: Dispatch<SetStateAction<Step[]>> = (fn) => {
      if (typeof fn === "function") steps = fn(steps);
      if (typeof fn === "object") steps = fn;
    };
    render(<Steps steps={steps} setSteps={setSteps} />);

    const addButton = screen.getByRole("button", { name: /Add step/ });
    expect(addButton).toBeDefined();
  });

  test("add first step", async () => {
    let steps: Step[] = [];
    const setSteps: Dispatch<SetStateAction<Step[]>> = (fn) => {
      if (typeof fn === "function") steps = fn(steps);
      if (typeof fn === "object") steps = fn;
    };

    const { rerender } = render(<Steps steps={steps} setSteps={setSteps} />);

    const addButton = screen.getByRole("button", { name: /Add step/ });
    expect(addButton).toBeDefined();
    fireEvent.click(addButton);

    expect(steps.length).toBe(1);
    rerender(<Steps steps={steps} setSteps={setSteps} />);

    expect(await screen.findByRole("textbox")).toBeDefined();

    const nameInput = screen.getByRole("textbox");
    expect(nameInput.matches(":focus")).toBe(true);

    fireEvent.change(nameInput, { target: { value: "Get started" } });
    fireEvent.blur(nameInput); // Blur should actually update the list
    expect(steps[0].name).toBe("Get started");

    fireEvent.focus(nameInput); // Need to focus before keypress, to work correctly
    fireEvent.keyDown(nameInput, { key: "Enter" });
    expect(steps.length).toBe(2);

    rerender(<Steps steps={steps} setSteps={setSteps} />);
    const inputs = await screen.findAllByRole("textbox");
    expect(inputs.length).toBe(2);

    // The delay causes test to be unreliable:
    //expect(inputs[0].matches(":focus")).toBe(false);
    //expect(inputs[1].matches(":focus")).toBe(true);
  });

  test("delete step", async () => {
    let steps: Step[] = [
      { idx: 0, name: "Get started", done: false },
      { idx: 1, name: "Continue", done: false },
      { idx: 2, name: "Fix a bug", done: false },
    ];

    const setSteps: Dispatch<SetStateAction<Step[]>> = (fn) => {
      if (typeof fn === "function") steps = fn(steps);
      if (typeof fn === "object") steps = fn;
    };

    render(<Steps steps={steps} setSteps={setSteps} />);
    const deleteButtons = screen.getAllByRole("button", { name: "Remove" });
    fireEvent.click(deleteButtons[1]);
    expect(steps.length).toBe(2);
  });

  test("up & down arrows", async () => {
    let steps: Step[] = [
      { idx: 0, name: "Get started", done: false },
      { idx: 1, name: "Continue", done: false },
      { idx: 2, name: "Fix a bug", done: false },
    ];

    const setSteps: Dispatch<SetStateAction<Step[]>> = (fn) => {
      if (typeof fn === "function") steps = fn(steps);
      if (typeof fn === "object") steps = fn;
    };

    render(<Steps steps={steps} setSteps={setSteps} />);
    const inputs = screen.getAllByRole("textbox");
    fireEvent.focus(inputs[1]);
    fireEvent.keyDown(inputs[1], { key: "ArrowUp" });
    expect(inputs[0].matches(":focus")).toBe(true);

    // Does nothing, as we are on the top already:
    fireEvent.keyDown(inputs[0], { key: "ArrowUp" });
    expect(inputs[0].matches(":focus")).toBe(true);
    expect(inputs[1].matches(":focus")).toBe(false);

    fireEvent.keyDown(inputs[0], { key: "ArrowDown" });
    expect(inputs[1].matches(":focus")).toBe(true);
    expect(inputs[0].matches(":focus")).toBe(false);
  });
});
