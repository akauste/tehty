import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/todo/page";

test("Page", async () => {
  // Method to test async Pages found here:
  // https://github.com/testing-library/react-testing-library/issues/1209#issuecomment-1546980195
  render(await Page());
  expect(screen.getByRole("heading", { name: "Todos" })).toBeDefined();
});
