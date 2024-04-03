import { Board } from "@/lib/db";
import { Dispatch, useState } from "react";
import { KanbanActions } from "@/lib/kanban-reducer";

interface HiddenBoardsProps {
  hiddenBoards: Board[];
  dispatch: Dispatch<KanbanActions>;
}

const HiddenBoards = ({ hiddenBoards, dispatch }: HiddenBoardsProps) => {
  const [showList, setShowList] = useState(false);

  return (
    <button
      className="bg-gray-300 border border-gray-600 rounded-full px-1 text-gray-800"
      onClick={() => setShowList((s) => !s)}
    >
      {hiddenBoards.length} hidden boards
      {showList && (
        <div className="absolute z-10 -ml-4 mt-2 bg-white p-2 shadow-md shadow-slate-400 min-w-24">
          <ul>
            {hiddenBoards.map((b) => (
              <li key={b.board_id}>
                <button
                  className="hover:text-sky-800"
                  onClick={() =>
                    dispatch({
                      type: "update-board",
                      board: { ...b, show: true },
                    })
                  }
                >
                  {b.name}{" "}
                  {b.tasks.length > 0 && <> ({b.tasks.length} tasks)</>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </button>
  );
};
export default HiddenBoards;
