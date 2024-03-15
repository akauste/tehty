export const userBoards = async () => {
  return Promise.resolve([
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
  ]);
};

export const userTasks = async () => {
  return Promise.resolve([]);
};
