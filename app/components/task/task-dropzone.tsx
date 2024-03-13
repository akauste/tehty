import { useDrop } from "react-dnd";
import { Task } from "@/lib/db";
import { Dispatch } from "react";
import { KanbanActions } from "../kanban/kanban";

interface TaskDropzoneProps {
  board_id: number;
  dispatch: Dispatch<KanbanActions>;
}

const TaskDropzone = ({ board_id, dispatch }: TaskDropzoneProps) => {
  const [, drop] = useDrop(
    () => ({
      accept: "task",
      drop({ id: draggedId, task: sourceTask }: { id: number; task: Task }) {
        if (board_id != sourceTask.board_id) {
          dispatch({ type: "append-remove-task", board_id, task: sourceTask });
        }
      },
    }),
    []
  );

  return (
    <li
      ref={(node) => drop(node)}
      className=" p-8 bg-sky-200 opacity-0 hover:opacity-100"
    >
      Drop task here
    </li>
  );
};

export default TaskDropzone;
