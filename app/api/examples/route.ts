import { auth } from "@/auth";
import { createExampleBoards } from "@/lib/db/examples";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  const user_id = session?.user?.email;

  const res = await createExampleBoards(user_id!); // Middleware takes care that user_id is always set
  return NextResponse.json(res);
}
