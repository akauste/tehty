import { useDrop } from "react-dnd";
import { Task } from "@/lib/db";
import { Dispatch } from "react";
import { KanbanActions } from "@/lib/kanban-reducer";
import { Add } from "@mui/icons-material";

interface TaskDropzoneProps {
  board_id: number;
  dispatch: Dispatch<KanbanActions>;
}

const TaskDropzone = ({ board_id, dispatch }: TaskDropzoneProps) => {
  const [, drop] = useDrop(
    () => ({
      accept: "task",
      drop({ id: draggedId, task: sourceTask }: { id: number; task: Task }) {
        console.log("DropZone dropped");
        fetch("/api/board/" + board_id + "/append", {
          method: "POST",
          body: JSON.stringify({ task_id: sourceTask.task_id }),
        })
          .then((res) => res.json())
          .then((data) => console.log("Got back:", data));
        dispatch({ type: "append-remove-task", board_id, task: sourceTask });
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
