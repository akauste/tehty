import { allTodos } from "../lib/db";

import { expect, vi, test, describe } from "vitest";
import { setReturnValue } from "@/__mocks__/kysely";

// *** Dummy tests, to check that the mock actually works
test("db-test", async () => {
  setReturnValue([]);
  const all = await allTodos();
  expect(all.length).toBe(0);
});

test("db-test 1", async () => {
  setReturnValue([1]);
  const all = await allTodos();
  expect(all.length).toBe(1);
});
