import {
  cleanup,
  screen,
  render,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import Steps, { Step } from "../steps";
import { Dispatch, SetStateAction, useState } from "react";

//  steps.tsx                         |   19.51 |      100 |       0 |   19.51 | 24-122

describe("<Steps ... />", () => {
  afterEach(cleanup);

  test("create empty steps", async () => {
    let steps: Step[] = [];
    const setSteps: Dispatch<SetStateAction<Step[]>> = (fn) => {
      if (typeof fn === "function") steps = fn(steps);
      if (typeof fn === "object") steps = fn;
    };
    const { rerender } = render(<Steps steps={steps} setSteps={setSteps} />);

    const addButton = screen.getByRole("button", { name: /Add step/ });
    expect(addButton).toBeDefined();
  });

  test("add first step", async () => {
    let steps: Step[] = [];
    const setSteps: Dispatch<SetStateAction<Step[]>> = (fn) => {
      if (typeof fn === "function") steps = fn(steps);
      if (typeof fn === "object") steps = fn;
    };
    //const [steps, setSteps] = useState<Step[]>([]);
    const { rerender } = render(<Steps steps={steps} setSteps={setSteps} />);

    const addButton = screen.getByRole("button", { name: /Add step/ });
    expect(addButton).toBeDefined();
    fireEvent.click(addButton);

    //await rerender(<Steps steps={steps} setSteps={setSteps} />);
    expect(steps.length).toBe(1);

    const delay = await waitFor(() => setTimeout(() => "done", 10));
    rerender(<Steps steps={steps} setSteps={setSteps} />);

    const nameInput = screen.getByRole("textbox");
    await expect(nameInput).toBeDefined();
    // Need to figure out how to get updated component, so the focus can be tested
    //expect(nameInput.matches(":focus")).toBe(true);
  });
});
