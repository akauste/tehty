import { Board, addTask, createBoard } from "../db";
import { Colors } from "@/components/ui/color-selector";

const getDateOffset = (offsetDays: number) => {
  const today = new Date();
  let offset = today;
  offset.setDate(today.getDate() + offsetDays);
  return new Date(offset.toISOString().slice(0, 10));
};

export const createExampleBoards = async (user_id: string) => {
  const boardTemplates = [
    { name: "Planned", background_color: Colors.Slate },
    { name: "Development", background_color: Colors.Blue },
    { name: "Testing", background_color: Colors.Emerald },
    { name: "Completed", background_color: Colors.Lime },
  ];

  // Add a few tasks
  const taskTemplates = [
    {
      name: "Example 1",
      description:
        "Test dragging this to other boards and then click edit button & mark completed",
    },
    { name: "Example 2", description: "Open this one and change color" },
    {
      name: "Late example",
      description: "This task is late, due date has passed",
      due_date: getDateOffset(-2),
    },
    {
      name: "Due soon example",
      description: "This task is due in a couple of days.",
      due_date: getDateOffset(+2),
    },
    {
      name: "Multi step example",
      description: "Click to see all steps.",
      steps: [
        { name: "Create examples", done: true },
        { name: "Experiment with drag and drop", done: false },
        { name: "Mark tasks completed", done: false },
        { name: "Set colors, change and add tasks", done: false },
        { name: "Test hiding and deleting tasks & boards", done: false },
        { name: "Remove test data", done: false },
      ],
    },
  ];

  const boards: Board[] = [];
  for (const template of boardTemplates) {
    const board = await createBoard({
      user_id,
      show: true,
      show_done_tasks: true,
      ...template,
    });
    boards.push({ ...board, tasks: [] });
  }

  for (const template of taskTemplates) {
    const task = await addTask({
      board_id: boards[0].board_id,
      user_id,
      background_color: "",
      done: false,
      ...template,
    });
    boards[0].tasks.push(task);
  }
  return boards;
};
