import { auth } from "@/auth";
import { addTask } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  const user_id = session?.user?.email;

  console.log("Adding task");
  const data = await req.json();

  data.user_id = user_id;
  const newRow = await addTask(data);
  console.log(data, newRow);
  return NextResponse.json({ ...newRow });
}
