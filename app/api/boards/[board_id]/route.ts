import { NextRequest } from "next/server";

type Params = {
  board_id: number;
};

export async function GET(req: NextRequest, context: { params: Params }) {
  // Implement get board, this is now only for completenes,
  // the nextjs frontend does not use this
}

// POST is actualy at: POST /api/boards (we doent know the id)

export async function PATCH(req: NextRequest, context: { params: Params }) {
  // Implement update board
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  // Implement delete board
}
