import { describe, test, expect, beforeEach, afterEach } from "vitest";
import {
  createBoard,
  deleteUserBoard,
  getUserBoard,
  updateBoardOrder,
  updateUserBoard,
  userBoards,
} from "@/lib/db";

describe("kanban board 1, happy path", () => {
  test('userBoards("testsuite") should be empty', async () => {
    const boards = await userBoards("testsuite");
    expect(boards.length).toBe(0);
  });

  const boardData = {
    user_id: "testsuite",
    name: "First",
    background_color: "purple",
    show: true,
    show_done_tasks: true,
  };
  let board_id;
  test('createBoard("testsuite") should be empty', async () => {
    const board = await createBoard(boardData);
    expect(board.name).toBe("First");
    expect(board.board_id).toBeGreaterThan(BigInt(0));
    board_id = board.board_id;
  });

  test("updateUserBoard(...)", async () => {
    const updated = {
      ...boardData,
      name: "Updated First",
      background_color: "cyan",
      board_id: board_id!,
    };
    const data = await updateUserBoard(updated);
    expect(data.name).toBe(updated.name);
    expect(data.background_color).toBe(updated.background_color);
    expect(data.board_id).toBe(board_id!);
  });

  test("getUserBoard", async () => {
    const data = await getUserBoard("testsuite", board_id!);
    expect(data).toBeDefined();
    if (data) {
      expect(data.board_id).toBe(board_id!);
      expect(data.name).toBe("Updated First");
      //      expect(data.orderno).toBe(1);
    }
  });

  test("deleteUserBoard", async () => {
    const del = await deleteUserBoard("testsuite", board_id!);
    expect(del.numDeletedRows).toBe(BigInt(1));
  });
});

describe("kanban board 1, failures", () => {
  let myBoards: number[] = [];
  beforeEach(async () => {
    const b1 = await createBoard({
      user_id: "testsuite2",
      name: "B1",
      background_color: "",
      show: true,
      show_done_tasks: true,
    });
    const b2 = await createBoard({
      user_id: "testsuite2",
      name: "B2",
      background_color: "",
      show: true,
      show_done_tasks: true,
    });
    const b3 = await createBoard({
      user_id: "testsuite2",
      name: "B3",
      background_color: "",
      show: true,
      show_done_tasks: true,
    });
    myBoards = [b1.board_id, b2.board_id, b3.board_id];
  });

  afterEach(async () => {
    myBoards.forEach((board_id) => deleteUserBoard("testsuite2", board_id));
  });

  test("userBoards()", async () => {
    const boards = await userBoards("testsuite2");
    expect(boards.length).toBe(3);
  });

  test("sortUserBoards", async () => {
    const rev = [...myBoards];
    rev.reverse(); // Reverses in place
    //console.log(myBoards, " -> ", rev);
    await updateBoardOrder(rev, "testsuite2");
    const boards = await userBoards("testsuite2");
    expect(boards.length).toBe(3);
    // Order should be reversed to creation
    expect(boards[0].name).toBe("B3");
    expect(boards[1].board_id).toBe(myBoards[1]);
    expect(boards[0].board_id).toBe(myBoards[2]);
    expect(boards[2].board_id).toBe(myBoards[0]);
  });
});
