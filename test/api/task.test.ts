import { describe, test, expect } from "vitest";

import { GET, POST } from "@/app/api/task/route";
import { NextRequest, NextResponse } from "next/server";
import { NewTask } from "@/lib/db";

test("GET /api/task", async () => {
  const req = new NextRequest("http://localhost:3000/api/task", {
    method: "GET",
  });
  const ret = await GET(req);
  const data = await ret.json();
  expect(data).toMatchObject({ ping: "pong" });
});

test("POST /api/task {garbage data} -> ERROR", async () => {
  const req = new NextRequest("https://google.com/api/task", {
    method: "POST",
    body: JSON.stringify({ action: "daa" }),
  });
  const ret = await POST(req);
  // Should not pass, because the body is garbage and should end up with error state
  expect(ret.status).not.toBe(200);
});

test("POST /api/task {good data} -> SUCCESS", async () => {
  const newTask: NewTask = {
    user_id: "test@example.test",
    done: false,
    board_id: 1,
    name: "New Task works",
    background_color: "",
    description: "This is a working example, that should pass",
    /*} & {
    orderno?: number | null | undefined;
    task_id?: number | undefined;
    due_date?: Date | ... 1 more ... | undefined;*/
  };
  const req = new NextRequest("https://google.com/api/task", {
    method: "POST",
    body: JSON.stringify(newTask),
  });
  const ret = await POST(req);
  const data = await ret.json();
  expect(ret.status).toBe(200);
  expect(data.task_id).toBeGreaterThan(0);
  expect(data.name).toBe(newTask.name);
  expect(data.description).toBe(newTask.description);
  expect(data.board_id).toBe(newTask.board_id);
});
