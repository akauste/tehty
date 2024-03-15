import { describe, test, expect } from "vitest";

import { GET, POST } from "@/app/api/task/route";
import { NextRequest, NextResponse } from "next/server";

test("GET /api/task", async () => {
  const req = new NextRequest("http://localhost:3000/api/task", {
    method: "GET",
  });
  const ret = await GET(req);
  const data = await ret.json();
  expect(data).toMatchObject({ ping: "pong" });
});

test.skip("POST /api/task", async () => {
  const req = new NextRequest("https://google.com/api/task", {
    method: "POST",
    body: JSON.stringify({ action: "daa" }),
  });
  const ret = await POST(req);
  expect(ret.status).not.toBe(200);
});
