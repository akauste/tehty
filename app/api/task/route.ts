import { auth } from "@/auth";
import { NewTask, addTask } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // This is here just as a temporary test to see if I can get the testing working
  return NextResponse.json({ ping: "pong" });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const user_id = session?.user?.email;

  if (!user_id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  console.log("Adding task");
  const data: NewTask = await req.json();

  // Add some real validator
  if (!data.name?.length || !data.board_id) {
    return NextResponse.json({ error: "Invalid data", data }, { status: 400 });
  }
  data.user_id = user_id;
  const newRow = await addTask(data);
  console.log(data, newRow);
  return NextResponse.json({ ...newRow });
}
