import { useDrop } from "react-dnd";
import { Task } from "@/lib/types";
import { Dispatch } from "react";
import { KanbanActions } from "@/lib/kanban-reducer";
import { Add } from "@mui/icons-material";

interface TaskDropzoneProps {
  board_id: number;
  index: number;
  dispatch: Dispatch<KanbanActions>;
}

const TaskDropzone = ({ board_id, index, dispatch }: TaskDropzoneProps) => {
  const [, drop] = useDrop(
    () => ({
      accept: "task",
      drop({ id: draggedId, task: sourceTask }: { id: number; task: Task }) {
        dispatch({
          type: "append-remove-task",
          board_id,
          index,
          task: sourceTask,
        });
      },
    }),
    []
  );

  return (
    <li
      ref={(node) => drop(node)}
      className="flex-grow p-2 text-center bg-sky-200 opacity-0 hover:opacity-100"
    >
      <button className="mt-2 w-full border border-transparent hover:border-sky-600 hover:text-sky-800 dark:hover:text-sky-200">
        <Add fontSize="small" /> Add
      </button>
      <p className="p-2">Drop task here</p>
    </li>
  );
};

export default TaskDropzone;
