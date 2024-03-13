"use client";
import { Board, Task } from "@/lib/db";
import { useState } from "react";
import { createPortal } from "react-dom";

interface AddTaskModalProps {
  boards?: Board[];
  task?: Task;
  save: (task: Task) => void;
  close: () => void;
}

const AddTaskModal = ({ boards, task, save, close }: AddTaskModalProps) => {
  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [boardId, setBoardId] = useState(
    boards ? boards[0].board_id : task?.board_id
  );
  const [dueDate, setDueDate] = useState(
    task?.dueDate?.toLocaleDateString("en-CA")
  );

  const saveTask = (event: React.FormEvent) => {
    console.log("saving...");

    event.preventDefault();
    save({
      task_id: task?.task_id ?? 0,
      board_id: boardId as number,
      orderno: task?.orderno || null,
      user_id: "testuser",
      name,
      description,
      backgroundColor: task?.backgroundColor ?? "",
      dueDate: dueDate ? new Date(dueDate) : null,
      done: task?.done || false,
      tags: task?.tags || [],
    });
  };
  return createPortal(
    <>
      <div
        className="fixed left-0 top-0 right-0 bottom-0 bg-black opacity-10 z-50 blur-xl"
        onClick={close}
      ></div>
      <div className="fixed left-0 top-0 right-0 bottom-0 flex items-center justify-center h-screen z-50">
        <div className="min-w-80 min-h-32 bg-white dark:bg-black p-4">
          <form className="flex flex-col space-y-2" onSubmit={saveTask}>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-slate-500 rounded"
            />
            <label>Description</label>
            <textarea
              className="border border-slate-500 rounded"
              onChange={(e) => setDescription(e.target.value)}
              defaultValue={description}
            ></textarea>
            <label>Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border border-slate-500 rounded"
            />
            <label>backgroundColor</label>
            <div>Color selector here...</div>
            <label>Tags</label>
            <input type="text" className="border border-slate-500 rounded" />
            {boards && (
              <>
                <label>Board</label>
                <select
                  className="border border-slate-500 rounded"
                  onChange={(e) => setBoardId(+e.target.value)}
                >
                  {boards.map((b) => (
                    <option
                      key={b.board_id}
                      value={b.board_id}
                      style={{ backgroundColor: b.backgroundColor }}
                    >
                      {b.name}
                    </option>
                  ))}
                </select>
              </>
            )}
            <div className="flex gap-2">
              <button
                type="reset"
                onClick={close}
                className="border rounded border-slate-500 p-2 flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border rounded border-sky-500 p-2 flex-1"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>,
    document.body
  );
};
export default AddTaskModal;
