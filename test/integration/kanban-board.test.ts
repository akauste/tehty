import { createKysely } from "@vercel/postgres-kysely";
import { describe, test, vi, expect } from "vitest";
import { Database, allTodos } from "@/lib/db";

const db = createKysely<Database>();

test("allTodos()", async () => {
  const todos = await allTodos();
  expect(todos.length).toBeGreaterThan(0);
});

test("sql", async () => {
  // await db.schema
  //   .createTable("test_table")
  //   .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
  //   .addColumn("name", "text", (col) => col.notNull())
  //   .execute();
  const task1 = await db
    .insertInto("todo")
    .values({ task: "test task 1", done: false, user_id: "testrunner" })
    .executeTakeFirstOrThrow();
  expect(task1).toBeDefined();
  expect(Number.parseInt(task1.numInsertedOrUpdatedRows?.toString()!)).toBe(1);
  //expect(Number.parseInt(task1.insertId?.toString()!)).toBeGreaterThan(0);
});
