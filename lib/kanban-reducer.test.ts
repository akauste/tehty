import { Board } from "./db";
import { SyncActions, kanbanReducer } from "./kanban-reducer";
import { expect, test, describe } from "vitest";

const initState: { boards: Board[]; unSyncedActions: SyncActions[] } = {
  boards: [
    {
      board_id: 1,
      orderno: 1, // number | null;
      user_id: "test", // string;
      name: "Board 1",
      background_color: "blue",
      show: true,
      show_done_tasks: true,
      tasks: [],
    },
    {
      board_id: 2,
      orderno: 2, // number | null;
      user_id: "test", // string;
      name: "Board 2",
      background_color: "red",
      show: true,
      show_done_tasks: true,
      tasks: [],
    },
  ],
  unSyncedActions: [],
};

describe("kanban-reducer", () => {
  describe("move-board", () => {
    test("move-board 1->2", () => {
      const state = kanbanReducer(initState, {
        type: "move-board",
        board_id: 1,
        atIndex: 1, // Zero based, move to second
      });
      expect(initState.boards[0]).toMatchObject(state.boards[1]);
      expect(initState.boards[1]).toMatchObject(state.boards[0]);
      expect(state.unSyncedActions.length).toBe(1);
    });
    test("move-board 2->1", () => {
      const state = kanbanReducer(initState, {
        type: "move-board",
        board_id: 2,
        atIndex: 0, // Zero based, move to second
      });
      expect(initState.boards[0]).toMatchObject(state.boards[1]);
      expect(initState.boards[1]).toMatchObject(state.boards[0]);
      expect(state.unSyncedActions.length).toBe(1);
    });
    test("move-board 1->1", () => {
      const state = kanbanReducer(initState, {
        type: "move-board",
        board_id: 1,
        atIndex: 0, // No move
      });
      expect(initState.boards[0]).toMatchObject(state.boards[0]);
      expect(initState.boards[1]).toMatchObject(state.boards[1]);
      // We expect to get move, that didn't happen
      expect(state.unSyncedActions.length).toBe(1);
    });
  });

  describe("update-board", () => {
    test("update-board", () => {
      const state = kanbanReducer(initState, {
        type: "update-board",
        board: {
          ...initState.boards[0],
          name: "Modified board 1",
          show: false,
        },
      });
      expect(state.boards[0].name).toEqual("Modified board 1");
      expect(state.boards[0].show).toBe(false);
      expect(state.unSyncedActions.length).toBe(1);
    });
  });

  describe("add-board", () => {
    test("add-board", () => {
      const newBoard = {
        board_id: 42,
        orderno: 2, // number | null;
        user_id: "test", // string;
        name: "Board 42",
        background_color: "yellow",
        show: true,
        show_done_tasks: false,
        tasks: [],
      };
      const state = kanbanReducer(initState, {
        type: "add-board",
        board: newBoard,
      });
      expect(state.boards.length).toBe(3);
      expect(state.boards[2]).toMatchObject(newBoard);
      expect(state.unSyncedActions.length).toBe(0);
    });
  });

  describe("task actions", () => {
    describe("task-create", () => {});
    describe("task-update", () => {});
    describe("task-delete", () => {});
    describe("task-move", () => {
      // all should be the same...
      // Task-move always: filterout old location,
      // Update board to new one,
      // insert to given Index
    });
  });
});
