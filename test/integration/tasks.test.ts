import { Task } from "@/lib/types";
import {
  createTask,
  createBoard,
  deleteUserBoard,
  deleteUserTask,
  getUserTask,
  moveToBoardTask,
  sortBoardTasks,
  updateTask,
} from "@/lib/db";
import { describe, test, expect, beforeAll, afterAll } from "vitest";

describe("kanban board tasks, happy path", () => {
  let myBoards: number[] = [];
  const user_id = "testsuite-tasks.test.ts";
  beforeAll(async () => {
    const b1 = await createBoard({
      user_id: user_id,
      name: "B1",
      background_color: "",
      show: true,
      show_done_tasks: true,
    });
    const b2 = await createBoard({
      user_id: user_id,
      name: "B2",
      background_color: "",
      show: true,
      show_done_tasks: true,
    });
    myBoards = [b1.board_id, b2.board_id];
  });

  afterAll(async () => {
    myBoards.forEach((board_id) =>
      deleteUserBoard("testsuite-tasks", board_id)
    );
  });

  describe("set of addTask() calls", () => {
    const allTasks: Task[] = [];
    test("addTask(...)", async () => {
      const task = await createTask({
        board_id: myBoards[0],
        user_id: user_id,
        name: "First task",
        description: "Description of the first task",
        background_color: "blue",
        done: false,
        steps: [
          { name: "Step 1", done: true },
          { name: "Other step", done: false },
        ],
      });
      expect(task.task_id).toBeGreaterThan(0);
      expect(task.steps?.length).toBe(2);
      allTasks.push(task);
    });

    test("addTask(...), add second test on same board", async () => {
      const task = await createTask({
        board_id: myBoards[0],
        user_id: user_id,
        name: "Second task",
        description: "...",
        background_color: "red",
        done: false,
      });
      expect(task.task_id).toBeGreaterThan(0);
      expect(task.orderno).toBeGreaterThan(allTasks[0].orderno!);
      allTasks.push(task);
    });

    test("updateTask(...)", async () => {
      const task = await createTask({
        board_id: myBoards[0],
        user_id: user_id,
        name: "To be updated",
        description: "",
        background_color: "pink",
        done: false,
      });
      allTasks.push(task);

      console.log("TASK: ", task);
      const updated = await updateTask({
        task_id: task.task_id,
        user_id: task.user_id,
        name: "Updated task",
        description: "Long description",
        done: true,
        steps: [{ name: "Only one", done: true }],
      });
      expect(updated.name).toBe("Updated task");
      expect(updated.description).toBe("Long description");
      expect(updated.done).toBe(true);
      expect(updated.board_id).toBe(task.board_id);
      expect(updated.orderno).toBe(task.orderno);
      expect(task.steps?.length).toBe(0);
      expect(updated.steps?.length).toBe(1);
      expect(updated.steps![0].done).toBe(true);
    });

    test("sortBoardTasks(...), reverse order", async () => {
      const newOrder = allTasks.map((t) => t.task_id);
      newOrder.reverse();
      await sortBoardTasks(myBoards[0], newOrder);

      const firstTask = await getUserTask(user_id, newOrder[0]);
      const lastTask = await getUserTask(
        user_id,
        newOrder[newOrder.length - 1]
      );
      expect(firstTask?.orderno!).toBeLessThan(lastTask?.orderno!);
      expect(firstTask?.task_id).toBe(allTasks[allTasks.length - 1].task_id); // name does not match, because of the update in the middle
      expect(lastTask?.name).toBe(allTasks[0].name);
    });

    test("deleteUserTask(...)", async () => {
      const lastTask = allTasks.pop() as Task;
      const res = await deleteUserTask(user_id, lastTask.task_id);
      const deletedTask = await getUserTask(user_id, lastTask.task_id);
      expect(res.numDeletedRows).toBe(BigInt(1));
      expect(deletedTask).toBeUndefined();
    });

    test("moveToBoardTask(...)", async () => {
      const firstTask = allTasks.shift() as Task;
      await moveToBoardTask(myBoards[1], firstTask.task_id, user_id, 0);
      const moved = (await getUserTask(user_id, firstTask.task_id)) as Task;
      expect(moved.board_id).toBe(myBoards[1]);
      expect(moved.board_id).not.toBe(firstTask.board_id);
    });

    test("ENV", () => {
      expect(process.env.TEST_VAR).toBe("Jippijaijee");
    });
    /* Rethinking this, this check should probably be done in the api-route
    test("addTask(...), add task to a board that does not exist", async () => {
      expect(async () => {
        const task = await addTask({
          board_id: myBoards[myBoards.length - 1] + 1, // Board that does not exist
          user_id: user_id,
          name: "This should fail task",
          description: "...",
          background_color: "red",
          done: false,
        });
      }).toThrow();
    });*/
  });
});
