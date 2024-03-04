import { setTodoDone } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  setTodoDone(data.todo_id, !data.done);

  return NextResponse.json(data);
}