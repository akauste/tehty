"use client";
import { Board, NewTask, Task } from "@/lib/db";
import { useState } from "react";
import { bgColors } from "../kanban/board-item";
import ColorSelector from "../ui/color-selector";
import Modal from "../ui/modal";
import Steps, { Step } from "./steps/steps";

interface AddTaskModalProps {
  boards?: Board[];
  task: Partial<Task>;
  //save: (task: Partial<Task>) => void;
  // BUG: still problems with the prop typing
  save: (task: any) => void;
  close: () => void;
}

const initSteps = [
  { name: "Step 1 (done)", done: true },
  { name: "Step 2 (not done)", done: false },
  { name: "Step 3", done: false },
  { name: "Step 4", done: false },
];

const AddTaskModal = ({ boards, task, save, close }: AddTaskModalProps) => {
  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [backgroundColor, setBackgroundColor] = useState(
    task?.background_color || bgColors[0]
  );
  const [boardId, setBoardId] = useState(
    boards ? boards[0].board_id : task?.board_id
  );
  const [dueDate, setDueDate] = useState(
    task?.due_date?.toLocaleDateString("en-CA")
  );
  const [done, setDone] = useState(task?.done ?? false);
  const [steps, setSteps] = useState(
    task.steps?.map((s, idx) => ({ ...s, idx })) || []
  );

  const saveTask = (event: React.FormEvent) => {
    console.log("saving...");

    event.preventDefault();
    const data: Partial<Task> = {
      ...task,
      board_id: boardId as number,
      name,
      description,
      background_color: backgroundColor,
      due_date: dueDate ? new Date(dueDate) : null,
      done,
      steps: steps.filter((s) => s.name.length > 0),
      //tags: task?.tags || [],
    };
    save(data);
  };
  return (
    <Modal close={close}>
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
        <Steps steps={steps} setSteps={setSteps} />
        <label>Background color</label>
        <ColorSelector
          colors={bgColors}
          color={backgroundColor}
          setColor={setBackgroundColor}
        />
        {/* Commented out until actually works
        <label>Tags</label>
  <input type="text" className="border border-slate-500 rounded" /> */}
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
                  style={{ backgroundColor: b.background_color }}
                >
                  {b.name}
                </option>
              ))}
            </select>
          </>
        )}
        <label>
          <input
            type="checkbox"
            checked={done}
            onChange={() => setDone((s) => !s)}
            className="mr-2"
          />
          Done
        </label>
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
    </Modal>
  );
};
export default AddTaskModal;
