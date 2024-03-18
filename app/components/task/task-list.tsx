import { Assignment } from "@mui/icons-material";
import { Task } from "@/lib/db";
import TaskItem from "./task-item";
import { Dispatch, useCallback } from "react";
import { KanbanActions } from "@/lib/kanban-reducer";
import TaskDropzone from "./task-dropzone";

interface TaskListProps {
  user_id: string;
  list: Task[];
  board_id: number;
  dispatch: Dispatch<KanbanActions>;
}

const TaskList = ({ board_id, list, dispatch }: TaskListProps) => {
  const tasks = list;

  const find = useCallback(
    (id: Number) => {
      const task = tasks.filter((t) => t.task_id === id)[0];
      return {
        task,
        index: tasks.indexOf(task),
      };
    },
    [tasks]
  );

  const move = (id: Number, atIndex: number) => {
    const { task, index } = find(id);
    dispatch({
      type: "move-task",
      board_id: task.board_id,
      removeIndex: index,
      atIndex,
      task,
    });
  };

  return (
    <ul className="space-y-2 flex-grow flex flex-col">
      {tasks.map((t) => (
        <TaskItem
          key={t.task_id.toString()}
          task={t}
          move={move}
          find={find}
          dispatch={dispatch}
        />
      ))}
      <TaskDropzone
        board_id={board_id}
        index={tasks.length}
        dispatch={dispatch}
      />
    </ul>
  );
};
export default TaskList;
