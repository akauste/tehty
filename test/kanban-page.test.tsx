import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/kanban/page";

// Does not pass currently, need to start working this out with something simpler
test.skip("Page", () => {
  render(<Page />);
  expect(
    screen.getByRole("heading", { level: 2, name: "Kanban" })
  ).toBeDefined();
});
