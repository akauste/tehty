import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/kanban/page";

test("Page", async () => {
  // Method to test async Pages found here:
  // https://github.com/testing-library/react-testing-library/issues/1209#issuecomment-1546980195
  render(await Page());
  expect(
    screen.getByRole("heading", { level: 2, name: "Kanban" })
  ).toBeDefined();
  expect(screen.getByRole("heading", { name: "Kanban test" })).toBeDefined();
});
