import { afterEach, describe, expect, test, vi } from "vitest";
import HeaderMainMenu from "../main-menu";
import { cleanup, render, screen } from "@testing-library/react";

const items = [
  { path: "/", name: "Home" },
  { path: "/kanban", name: "Kanban" },
  { path: "/todo", name: "Todo" },
  { path: "/info", name: "Info" },
];
let activePath: string;
vi.mock("next/navigation", (): any => {
  return { usePathname: () => activePath };
});

describe("<HeaderMainMenu />", () => {
  afterEach(cleanup);

  for (let item of items) {
    test("activating " + item.name, () => {
      activePath = item.path;
      render(<HeaderMainMenu />);
      expect(screen.getByRole("link", { name: item.name }).classList).toContain(
        "font-bold"
      );
    });
  }
});
// All files                         |    62.1 |    79.62 |   50.98 |    62.1 |
