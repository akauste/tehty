import { auth } from "@/auth";
import { NewTask } from "@/lib/types";
import { createTask } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // This is here just as a temporary test to see if I can get the testing working
  return NextResponse.json({ ping: "pong" });
}

// Add new task: POST /api/tasks
export async function POST(req: NextRequest) {
  const session = await auth();
  const user_id = session?.user?.email;

  if (!user_id)
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );

  console.log("Adding task");
  const data: NewTask = await req.json();

  // Add some real validator
  if (!data.name?.length || !data.board_id) {
    return NextResponse.json({ error: "Invalid data", data }, { status: 400 });
  }
  data.user_id = user_id;
  const newRow = await createTask(data);
  console.log(data, newRow);
  return NextResponse.json({ ...newRow });
}

// Task sorting happens under the board PATCH /api/boards/[board_id]/tasks
// export async function PATCH(req: NextRequest) {
//   // Implement the task sorting here
// }
