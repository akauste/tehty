import { testApiHandler } from "next-test-api-route-handler";
import { describe, expect, test, vi } from "vitest";
import * as appHandler from "@/app/api/boards/route";
import * as boardIdAppHandler from "@/app/api/boards/[board_id]/route";
import * as boardsIdTasksAppHandler from "@/app/api/boards/[board_id]/tasks/route";
import * as tasksAppHandler from "@/app/api/tasks/route";
import * as tasksIdAppHandler from "@/app/api/tasks/[task_id]/route";
import { NewBoard, NewTask } from "@/lib/types";

const user_id = "dummy.test@testsuite.local";

const session = { active: true };

vi.mock("@/auth", async () => {
  return {
    auth: async () =>
      Promise.resolve(
        session.active
          ? {
              user: {
                email: "dummy.test@testsuite.local",
              },
            }
          : null
      ),
  };
});

const boards: NewBoard[] = [
  {
    user_id,
    name: "First board",
    background_color: "blue",
    show: true,
    show_done_tasks: false,
  },
  {
    user_id,
    name: "Middle board",
    background_color: "red",
    show: true,
    show_done_tasks: true,
  },
  {
    user_id,
    name: "Last board",
    background_color: "green",
    show: true,
    show_done_tasks: false,
  },
  {
    user_id,
    name: "Hidden board",
    background_color: "gray",
    show: false,
    show_done_tasks: false,
  },
];

describe("API /boards", () => {
  let idx = 0;
  for (const board of boards) {
    test("add boards " + idx, async () => {
      expect.hasAssertions();
      const boardJson = JSON.stringify(board);
      await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: boardJson,
          });
          const data = await res.json();
          expect(data.board_id).toBeGreaterThan(0);
          expect(data.orderno).toBe(idx);
          idx++;
          expect(data.name).toBe(board.name);
          expect(data.background_color).toBe(board.background_color);
          expect(data.user_id).toBe(board.user_id);
          expect(data.show).toBe(board.show);
          expect(data.show_done_tasks).toBe(board.show_done_tasks);
          expect(data.tasks.length).toBe(0);
          board.board_id = data.board_id;
          board.orderno = data.orderno;
        },
      });
    });
  }

  test("sort boards", async () => {
    expect.hasAssertions();
    // Visible boards, move third to first:
    expect(boards[0].board_id).toBeGreaterThan(0);
    expect(boards[1].board_id).toBeGreaterThan(0);
    expect(boards[2].board_id).toBeGreaterThan(0);
    const board_ids = [
      boards[2].board_id,
      boards[0].board_id,
      boards[1].board_id,
    ];
    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          body: JSON.stringify(board_ids),
        });
        expect(res.status).toBe(200);
      },
    });
  });

  test("update board", async () => {
    expect.hasAssertions();
    const board = boards[0];
    board.name = "Updated board";
    board.background_color = "pink";
    const boardJson = JSON.stringify(board);
    await testApiHandler({
      appHandler: boardIdAppHandler,
      params: { board_id: board.board_id?.toString() as string },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          body: boardJson,
        });
        const data = await res.json();
        expect(data.board_id).toBe(board.board_id);
        expect(data.name).toBe(board.name);
        expect(data.background_color).toBe(board.background_color);
        expect(data.user_id).toBe(board.user_id);
        expect(data.show).toBe(board.show);
        expect(data.show_done_tasks).toBe(board.show_done_tasks);
      },
    });
  });

  test("delete board", async () => {
    expect.hasAssertions();
    const board = boards[0];

    await testApiHandler({
      appHandler: boardIdAppHandler,
      params: { board_id: board.board_id?.toString() as string },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "DELETE",
        });
        expect(res.status).toBe(200);
      },
    });
  });

  const task: NewTask = {
    board_id: 0,
    user_id,
    name: "First task",
    background_color: "yellow",
    description: "This is the first task description",
    done: false,
  };

  test("add task", async () => {
    task.board_id = boards[2].board_id!;
    const board = boards[2];

    expect.hasAssertions();
    expect(task.board_id).toBeGreaterThan(0);
    const taskJson = JSON.stringify(task);
    await testApiHandler({
      appHandler: tasksAppHandler,
      //params: // No params { task_id: task.task_id?.toString() as string },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: taskJson,
        });
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.task_id).toBeGreaterThan(0);
        expect(data.orderno).toBeDefined();
        task.task_id = data.task_id;
        task.orderno = data.orderno;
      },
    });
  });

  test("update task", async () => {
    task.board_id = boards[2].board_id!;
    task.steps = [
      { name: "First step", done: true },
      { name: "Last step", done: false },
    ];

    expect.hasAssertions();
    expect(task.board_id).toBeGreaterThan(0);
    await testApiHandler({
      appHandler: tasksIdAppHandler,
      params: { task_id: task.task_id?.toString() as string },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          body: JSON.stringify(task),
        });
        const data = await res.json();
        console.warn(data);
        expect(res.status).toBe(200);

        expect(data.task_id).toBeGreaterThan(0);
        expect(data.orderno).toBeDefined();
      },
    });
  });

  test.todo("get task", async () => {
    expect.hasAssertions();

    await testApiHandler({
      appHandler: tasksIdAppHandler,
      params: { task_id: task.task_id?.toString() as string },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "GET",
        });
        expect(res.status).toBe(200);

        const data = await res.json();
        expect(data.name).toBe(task.name);
        expect(data.steps).toBe([]);
      },
    });
  });

  test("remove task", async () => {
    expect.hasAssertions();

    await testApiHandler({
      appHandler: tasksIdAppHandler,
      params: { task_id: task.task_id?.toString() as string },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "DELETE",
        });
        expect(res.status).toBe(200);

        delete task.task_id;
        delete task.orderno;
      },
    });
  });

  test("add and sort", async () => {
    const names = ["Task 3", "Task 1", "Task 2"];
    const board_id: number = boards[1].board_id!;
    expect(board_id).toBeGreaterThan(0);
    const tasks: NewTask[] = names.map((name) => ({
      name,
      board_id: board_id,
      user_id,
      description: "",
      background_color: "silver",
      done: false,
      steps: [],
    }));

    expect.hasAssertions();
    for (const task of tasks) {
      await testApiHandler({
        appHandler: tasksAppHandler,
        params: { task_id: task.task_id?.toString() as string },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: "POST",
            body: JSON.stringify(task),
          });
          expect(res.status).toBe(200);
          const data = await res.json();
          task.task_id = data.task_id;
          task.orderno = data.orderno;
        },
      });
    }
    // Set new order:
    const reordered = [{ ...tasks[1] }, { ...tasks[2] }, { ...tasks[0] }];
    const reordered_ids = reordered.map((t) => t.task_id);
    await testApiHandler({
      appHandler: boardsIdTasksAppHandler,
      params: { board_id: board_id.toString() },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          body: JSON.stringify(reordered_ids),
        });
        expect(res.status).toBe(200);
      },
    });
  });
});

describe("API /boards failures", () => {
  const boardTemplate = {
    user_id,
    name: "Test board",
    background_color: "blue",
    show: true,
    show_done_tasks: false,
  };

  test("add board without name", async () => {
    expect.hasAssertions();
    const board = { ...boardTemplate, name: "" };
    const boardJson = JSON.stringify(board);

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: boardJson,
        });
        expect(res.status).toBe(400);
      },
    });
  });

  test("add board without login", async () => {
    expect.hasAssertions();
    const board = { ...boardTemplate };
    const boardJson = JSON.stringify(board);
    session.active = false; // Temporarily "log out"

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "POST",
          body: boardJson,
        });
        expect(res.status).toBe(401);
      },
    });

    session.active = true; // Set session state back to active
  });

  test("sort boards without login", async () => {
    expect.hasAssertions();
    session.active = false; // Temporarily "log out"

    await testApiHandler({
      appHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          body: "[]",
        });
        expect(res.status).toBe(401);
      },
    });

    session.active = true; // Set session state back to active
  });

  test("update board", async () => {
    expect.hasAssertions();
    session.active = false; // Temporarily "log out"

    const boardJson = JSON.stringify({});
    await testApiHandler({
      appHandler: boardIdAppHandler,
      params: { board_id: "666" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "PATCH",
          body: boardJson,
        });
        expect(res.status).toBe(401);
      },
    });

    session.active = true;
  });

  test("delete board", async () => {
    expect.hasAssertions();
    session.active = false; // Temporarily "log out"

    await testApiHandler({
      appHandler: boardIdAppHandler,
      params: { board_id: "123" },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: "DELETE",
        });
        expect(res.status).toBe(401);
      },
    });
  });
});
