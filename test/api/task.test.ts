import { describe, test, expect } from "vitest";

import { GET, POST } from "@/app/api/tasks/route";
import { NextRequest, NextResponse } from "next/server";
import { NewTask } from "@/lib/types";
import { PATCH } from "@/app/api/tasks/[task_id]/route";

let task_id: number;

test("GET /api/tasks", async () => {
  const req = new NextRequest("http://localhost:3000/api/tasks", {
    method: "GET",
  });
  const ret = await GET(req);
  const data = await ret.json();
  expect(data).toMatchObject({ ping: "pong" });
});

describe("POST /api/tasks/[id] = createTask", () => {
  test("POST /api/tasks {garbage data} -> ERROR", async () => {
    const req = new NextRequest("https://google.com/api/tasks", {
      method: "POST",
      body: JSON.stringify({ action: "daa" }),
    });
    const ret = await POST(req);
    const data = await ret.json();
    // Should not pass, because the body is garbage and should end up with error state
    expect(data).toMatchObject({
      error: "Invalid data",
      data: { action: "daa" },
    });
    expect(ret.status).toBe(400);
  });

  test("POST /api/tasks {good data} -> SUCCESS", async () => {
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
    const req = new NextRequest("https://google.com/api/tasks", {
      method: "POST",
      body: JSON.stringify(newTask),
    });
    const ret = await POST(req);
    const data = await ret.json();
    expect(ret.status).toBe(200);
    expect(data.task_id).toBeGreaterThan(0);
    task_id = data.task_id; // Remember this, so runnning test againts real db we use working value
    expect(data.name).toBe(newTask.name);
    expect(data.description).toBe(newTask.description);
    expect(data.board_id).toBe(newTask.board_id);
  });
});

describe("PATCH /api/tasks/[id] = updateTask", () => {
  test("PATCH /api/tasks/1 {garbage data} -> ERROR", async () => {
    const req = new NextRequest("https://google.com/api/tasks/" + task_id, {
      method: "POST",
      body: JSON.stringify({ action: "daa" }),
    });
    const ret = await POST(req);
    const data = await ret.json();
    // Should not pass, because the body is garbage and should end up with error state
    expect(data).toMatchObject({
      error: "Invalid data",
      data: { action: "daa" },
    });
    expect(ret.status).toBe(400);
  });

  test("PATCH /api/tasks/" + task_id + " {good data} -> SUCCESS", async () => {
    const oldTask: NewTask = {
      task_id: task_id,
      user_id: "test@example.test",
      done: false,
      board_id: 1,
      name: "New Task updated works",
      background_color: "",
      description: "UPDATE: This is a working example, that should pass",
      /*} & {
    orderno?: number | null | undefined;
    task_id?: number | undefined;
    due_date?: Date | ... 1 more ... | undefined;*/
    };
    const req = new NextRequest("https://google.com/api/tasks/1", {
      method: "PATCH",
      body: JSON.stringify(oldTask),
    });
    const ret = await PATCH(req, { params: { task_id: 1 } });
    const data = await ret.json();
    expect(ret.status).toBe(200);
    expect(data.task_id).toBe(task_id);
    expect(data.name).toBe(oldTask.name);
    expect(data.description).toBe(oldTask.description);
    expect(data.board_id).toBe(oldTask.board_id);
  });
});
