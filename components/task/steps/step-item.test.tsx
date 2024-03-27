import { describe, expect, test, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import StepItem from "./step-item";
import { beforeEach } from "node:test";

describe("<StepItem ... />", () => {
  let name = "First Item";
  const update = vi.fn();
  const remove = vi.fn();
  const refValue: { el: HTMLInputElement | null } = { el: null };
  const ref = (el: HTMLInputElement) => {
    refValue.el = el;
    return refValue;
  };
  const prev = vi.fn();
  const next = vi.fn();

  render(
    <StepItem
      index={42}
      name={name}
      done={false}
      update={update}
      remove={remove}
      inputRef={ref}
      prevStep={prev}
      nextStep={next}
    />
  );

  test("rendering", () => {
    const step = screen.getByRole("listitem");
    expect(step).toBeTruthy();
    expect(refValue.el!.value).toBe(name);
  });

  test("ArrowUp in name", () => {
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "ArrowUp",
      which: 38,
      keyCode: 38,
    });
    expect(prev).toBeCalledTimes(1);
    expect(prev.mock.calls[0][0]).toBe(42);
    expect(update).toBeCalledTimes(1);
  });

  test("ArrowDown in name", () => {
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "ArrowDown",
    });
    expect(next).toBeCalledTimes(1);
    expect(prev.mock.calls[0][0]).toBe(42);
    expect(update).toBeCalledTimes(2);
  });

  test("Enter-keydown in name", () => {
    fireEvent.keyDown(screen.getByRole("textbox"), {
      key: "Enter",
    });
    expect(next).toBeCalledTimes(2);
    expect(prev.mock.calls[0][0]).toBe(42);
    expect(update).toBeCalledTimes(3);
  });

  test("Check done", () => {
    fireEvent.click(screen.getByRole("checkbox"));
    expect(update).toBeCalledTimes(4);
    expect(update.mock.calls[3][2]).toBe(true);
  });

  test("Delete clicked", () => {
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(remove).toBeCalledTimes(1);
    expect(remove.mock.calls[0][0]).toBe(42);
  });
});
