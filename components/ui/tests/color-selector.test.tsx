import { cleanup, screen, render, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import ColorSelector from "../color-selector";

const colors = ["red", "green", "blue", "orange", "black"];

const setColor = vi.fn();

describe("<ColorSelector ... />", () => {
  beforeEach(() => {
    render(<ColorSelector colors={colors} color="red" setColor={setColor} />);
  });

  afterEach(cleanup);

  test("display", () => {
    expect(screen.getByTitle("red")).toBeDefined();
    expect(screen.getByTitle("orange")).toBeDefined();
    fireEvent.click(screen.getByTitle("orange"));
    expect(setColor).toBeCalledTimes(1);
  });
});
