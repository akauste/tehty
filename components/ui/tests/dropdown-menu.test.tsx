import { cleanup, screen, render, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import DropdownMenu from "../dropdown-menu";
import MenuItem from "../menuitem";

const one = vi.fn();
const two = vi.fn();
const three = vi.fn();

describe("<DropdownMenu ... />", () => {
  describe("default button", () => {
    beforeEach(() => {
      render(
        <DropdownMenu>
          <MenuItem onClick={one}>Item one</MenuItem>
          <MenuItem onClick={two}>Item two</MenuItem>
          <MenuItem onClick={three} disabled={true}>
            Item three
          </MenuItem>
        </DropdownMenu>
      );
    });

    afterEach(cleanup);

    test("basic menu", () => {
      expect(screen.getAllByRole("button").length).toBe(1);

      fireEvent.click(screen.getByRole("button"));
      const first = screen.getByRole("button", { name: "Item one" });
      expect(first).toBeDefined();
      expect(screen.getByRole("button", { name: "Item two" })).toBeDefined();
      const third = screen.getByRole("button", { name: "Item three" });
      expect(third).toBeDefined();
    });

    test("basic menu", () => {
      // Open menu
      fireEvent.click(screen.getByRole("button"));

      const first = screen.getByRole("button", { name: "Item one" });
      expect(first).toBeDefined();

      fireEvent.click(first);
      expect(one).toBeCalledTimes(1);
    });

    test("open menu & can't click disabled button", () => {
      fireEvent.click(screen.getByRole("button"));

      const third = screen.getByRole("button", { name: "Item three" });
      expect(third).toBeDefined();

      fireEvent.click(third);
      expect(three).toBeCalledTimes(0);
    });
  });

  describe("custom button", () => {
    beforeEach(() => {
      render(
        <DropdownMenu buttonContent={"customized"}>
          <MenuItem onClick={one}>Item one</MenuItem>
          <MenuItem onClick={two}>Item two</MenuItem>
          <MenuItem onClick={three} disabled={true}>
            Item three
          </MenuItem>
        </DropdownMenu>
      );
    });

    afterEach(cleanup);

    test("button has text customized", () => {
      expect(screen.getByRole("button").textContent).toBe("customized");
    });
  });
});
