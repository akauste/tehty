import { Board } from "@/lib/db";
import { bgColors } from "./board-item";
import { useState } from "react";
import ColorSelector from "../ui/color-selector";

interface BoardEditProps {
  board: Board;
  update: (board: Board) => void;
  close: () => void;
}

const BoardEdit = ({ board, update, close }: BoardEditProps) => {
  const [name, setName] = useState(board.name || "");
  const [backgroundColor, setBackgroundColor] = useState(
    board.backgroundColor || ""
  );
  const [show, setShow] = useState<boolean>(board.show || true);
  const [showDoneTasks, setShowDoneTasks] = useState<boolean>(
    board.showDoneTasks || true
  );

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    update({ ...board, name, backgroundColor, show, showDoneTasks });
    close();
  };

  return (
    <div className="absolute z-10 w-44 bg-slate-100 dark:bg-slate-700 shadow-sm shadow-slate-800">
      <form method="" onSubmit={save} className="p-2 flex flex-col space-y-1">
        <label>{board.board_id}</label>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-slate-500 rounded w-full"
        />
        <label>Color</label>
        <ColorSelector
          colors={bgColors}
          color={backgroundColor}
          setColor={setBackgroundColor}
        />
        {/*<div className="flex flex-row gap-1">
          {bgColors.map((color) => (
            <button
              key={color}
              className="w-4 h-4 hover:opacity-50"
              onClick={() => setBackgroundColor(color)}
              style={{
                backgroundColor: color,
                boxShadow: color == backgroundColor ? `1px -1px 2px black` : "",
              }}
            ></button>
          ))}
        </div> */}
        <label>
          <input
            type="checkbox"
            checked={show}
            onChange={() => setShow((s) => !s)}
          />
          Show
        </label>
        <label>
          <input
            type="checkbox"
            checked={showDoneTasks}
            onChange={() => setShowDoneTasks((s) => !s)}
          />
          Show done tasks
        </label>
        <div className="flex w-full gap-2">
          <button
            type="reset"
            className="border border-slate-500 hover:bg-slate-200 rounded p-1 flex-1"
            onClick={close}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="border border-sky-500 bg-sky-200 hover:bg-sky-100 rounded p-1 flex-1"
            onClick={save}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
export default BoardEdit;
