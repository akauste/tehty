import { Board, Task } from "@/lib/types";
import { Dispatch, useState } from "react";
import AddTaskModal from "../task/add-task-modal";
import { KanbanActions } from "@/lib/kanban-reducer";

interface AddTaskButtonProps {
  visibleBoards: Board[];
  dispatch: Dispatch<KanbanActions>;
}

const AddTaskButton = ({ visibleBoards, dispatch }: AddTaskButtonProps) => {
  const [showModal, setShowModal] = useState(false);

  const addTask = async (task: Task) => {
    dispatch({
      type: "append-task",
      board_id: task.board_id,
      task: task,
    });
    setShowModal(false);
  };

  return (
    <>
      {visibleBoards.length > 0 && (
        <button
          className=" px-1 border border-slate-500 rounded hover:bg-slate-200 hover:text-sky-800"
          onClick={() => setShowModal((s) => !s)}
        >
          + Add task
        </button>
      )}
      {showModal ? (
        <AddTaskModal
          boards={visibleBoards}
          task={{}}
          save={addTask}
          close={() => setShowModal(false)}
        />
      ) : null}
    </>
  );
};
export default AddTaskButton;
