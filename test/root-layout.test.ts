import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock(
  "next/navigation",
  async (importOriginal) => ({
    ...(await importOriginal<typeof import("@/lib/db")>()),
    usePathname: () => ({
      match: (s: string) => false,
    }),
  })
  // async (importOriginal) => {
  //   return {
  //     ...(await importOriginal<typeof import("@/lib/db")>()),
  //     ...mockedDb,
  //   };
  //}
);

import Layout from "@/app/layout";

let session: any = {};

// https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

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

describe("Layout /", () => {
  test("root layout without login", async () => {
    render(await Layout({ children: null }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
      /Tehty/
    );

    // without login, sign in link must be present, and sign out not:
    expect(screen.getByRole("link", { name: "Sign in" })).toBeDefined();
    const links = await screen.queryByRole("link", { name: /Sign out/ });
    expect(links).toBe(null);
  });

  test("root layout with valid user", async () => {
    session = {
      user: { email: "validuser", image: "https://test.dev/image.jpg" },
    };
    render(await Layout({ children: null }));
    expect(screen.getByRole("heading", { level: 1 }).textContent).toMatch(
      /Tehty/
    );

    // with logged in user, sign in link must be present, and sign out not:
    const links = await screen.queryByRole("link", { name: "Sign in" });
    expect(links).toBe(null);
    expect(screen.getByRole("link", { name: /Sign out/ })).toBeDefined();
  });
});
