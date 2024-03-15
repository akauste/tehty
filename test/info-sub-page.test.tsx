import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "../app/info/sub/page";
import Layout from "../app/layout";

test("Page", async () => {
  render(await Page());
  //render(<Page />, { wrapper: Layout });
  // expect(
  //   screen.getByRole("heading", { level: 2, name: "test@example.test" })
  // ).toBeDefined();
  expect(screen.getByRole("heading", { level: 2, name: "Sub" })).toBeDefined();
});
