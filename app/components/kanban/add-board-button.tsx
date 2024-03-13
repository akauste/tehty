import { Dispatch, useState } from "react";
import BoardEdit from "./board-edit";
import { KanbanActions } from "./kanban";
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
        <BoardEdit
          board={{
            board_id: Math.ceil(Math.random() * 10000),
            user_id,
            orderno: 0,
            name: "",
            background_color: "#94a3b8",
            show: true,
            show_done_tasks: true,
            tasks: [],
          }}
          update={addBoard}
          close={() => setShowEdit(false)}
        />
      )}
    </>
  );
};
export default AddBoardButton;
