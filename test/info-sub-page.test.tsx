import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/info/sub/page";

/* Just to make sure testing works with a simple page */
test("Page", () => {
  render(<Page />);
  // expect(
  //   screen.getByRole("heading", { level: 2, name: "test@example.test" })
  // ).toBeDefined();
  expect(screen.getByRole("heading", { level: 2, name: "Sub" })).toBeDefined();
});
