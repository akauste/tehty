import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

// vi.mock("@/lib/db", async (importOriginal) => {
//   return {
//     ...(await importOriginal<typeof import("@/lib/db")>()),
//     ...mockedDb,
//   };
// });

import Page from "../app/page";

let session: any = {};

vi.mock("@/auth", async (importOriginal) => {
  return {
    auth: () => {
      return Promise.resolve(
        session
        // Test with no session
        //user: { email: "test@example.test", },
      );
    },
  };
});

afterEach(cleanup);

describe("GET /", () => {
  test("home page without login", async () => {
    // Method to test async Pages found here:
    // https://github.com/testing-library/react-testing-library/issues/1209#issuecomment-1546980195
    render(await Page());
    expect(
      //screen.getByRole("heading", { level: 1, name: "Tehty" })
      screen.getByRole("heading", { level: 1 }).textContent
    ).toMatch(/Tehty/);
    expect(screen.getByRole("link", { name: "Sign in" })).toBeDefined();
  });

  test("home page with valid user", async () => {
    session = { user: { email: "validuser" } };
    // Method to test async Pages found here:
    // https://github.com/testing-library/react-testing-library/issues/1209#issuecomment-1546980195
    render(await Page());
    expect(
      //screen.getByRole("heading", { level: 1, name: "Tehty" })
      screen.getByRole("heading", { level: 1 }).textContent
    ).toMatch(/Tehty/);
    const links = await screen.queryByRole("link", { name: "Sign in" });
    expect(links).toBe(null);
  });
});
