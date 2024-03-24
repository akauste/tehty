import { Dispatch, useState } from "react";
import BoardEditor from "./board-editor";
import { KanbanActions } from "@/lib/kanban-reducer";
import { Board } from "@/lib/db";

const AddBoardButton = ({
  user_id,
  dispatch,
}: {
  user_id: string;
  dispatch: Dispatch<KanbanActions>;
}) => {
  const [showEdit, setShowEdit] = useState(false);

  const addBoard = (board: Board) => dispatch({ type: "add-board", board });

  return (
    <>
      <button
        className=" px-1 border border-slate-500 rounded hover:bg-slate-200 hover:text-sky-800"
        onClick={() => setShowEdit((s) => !s)}
      >
        + Add board
      </button>
      {showEdit && (
        <BoardEditor
          board={{
            user_id,
            name: "",
            background_color: "#94a3b8",
            show: true,
            show_done_tasks: true,
          }}
          save={addBoard}
          close={() => setShowEdit(false)}
        />
      )}
    </>
  );
};
export default AddBoardButton;
