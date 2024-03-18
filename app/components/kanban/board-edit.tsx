"use client";
import { Board } from "@/lib/db";
import { bgColors } from "./board-item";
import { useState } from "react";
import ColorSelector from "../ui/color-selector";
import { createPortal } from "react-dom";
import Modal from "../ui/modal";

interface BoardEditProps {
  board: Board;
  update: (board: Board) => void;
  close: () => void;
}

const BoardEdit = ({ board, update, close }: BoardEditProps) => {
  const [name, setName] = useState(board.name || "");
  const [backgroundColor, setBackgroundColor] = useState(
    board.background_color || ""
  );
  const [show, setShow] = useState<boolean>(board.show || true);
  const [showDoneTasks, setShowDoneTasks] = useState<boolean>(
    board.show_done_tasks || true
  );

  const save = (event: React.FormEvent) => {
    event.preventDefault();
    update({
      ...board,
      name,
      background_color: backgroundColor,
      show,
      show_done_tasks: showDoneTasks,
    });
    close();
  };

  return (
    <Modal close={close}>
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
    </Modal>
  );
};
export default BoardEdit;
