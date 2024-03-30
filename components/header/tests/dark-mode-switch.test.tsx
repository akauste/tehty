import { afterEach, describe, expect, test, vi } from "vitest";
import DarkModeSwitch from "../dark-mode-switch";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

describe("<DarkModeSwitch />", () => {
  afterEach(cleanup);

  test("initial light mode", async () => {
    const matchMediaMock = (q: string): any => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matches: false,
    });
    window.matchMedia = vi.fn(matchMediaMock);

    render(<DarkModeSwitch />);
    const svg = await screen.findByTestId("LightModeIcon");
    expect(svg).toBeDefined();

    fireEvent.click(screen.getByRole("button"));
    const dark = await screen.findByTestId("DarkModeIcon");
    expect(dark).toBeDefined();

    const scheme =
      document.documentElement.style.getPropertyValue("color-scheme");
    expect(scheme).toBe("dark");
    expect(document.documentElement.classList).toContain("dark");
  });

  test("initial dark mode", async () => {
    const matchMediaMock = (q: string): any => ({
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matches: true,
    });
    window.matchMedia = vi.fn(matchMediaMock);

    render(<DarkModeSwitch />);
    const svg = await screen.findByTestId("DarkModeIcon");
    expect(svg).toBeDefined();
    expect(document.documentElement.classList).toContain("dark");

    // Switch to light mode
    fireEvent.click(screen.getByRole("button"));
    const dark = await screen.findByTestId("LightModeIcon");
    expect(dark).toBeDefined();

    const scheme =
      document.documentElement.style.getPropertyValue("color-scheme");
    expect(scheme).toBe("light");
    expect(document.documentElement.classList).not.toContain("dark");
  });
});
