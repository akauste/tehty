import { DeleteOutlined, DragHandle } from "@mui/icons-material";
import { useState } from "react";

interface StepProps {
  index: number;
  name: string;
  done: boolean;
  update: (index: number, name: string, done: boolean) => void;
  remove: (index: number) => void;
  inputRef: (el: HTMLInputElement) => any;
  prevStep: (index: number) => void;
  nextStep: (index: number) => void;
}

const StepItem = ({
  index,
  name: initName,
  done: initDone,
  update,
  remove,
  inputRef,
  prevStep,
  nextStep,
}: StepProps) => {
  const [done, setDone] = useState(initDone);
  const [name, setName] = useState(initName);

  const nameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const removeHandler = (e: React.FormEvent) => {
    e.preventDefault();
    remove(index);
  };
  const keydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(e);
    if (e.key === "ArrowUp") {
      e.preventDefault();
      update(index, name, done);
      prevStep(index);
    }
    if (e.key === "Enter" || e.key === "ArrowDown") {
      e.preventDefault();
      update(index, name, done);
      nextStep(index);
    }
  };

  return (
    <li className="flex gap-1">
      <DragHandle fontSize="small" />
      <input
        type="checkbox"
        checked={done}
        onChange={(e) => {
          setDone(e.target.checked);
          update(index, name, e.target.checked);
        }}
      />
      <input
        type="text"
        ref={inputRef}
        value={name}
        className="flex-grow border active:outline-none active:border-sky-600"
        onChange={nameHandler}
        onKeyDown={keydownHandler}
        onBlur={(e) => update(index, name, done)}
      />
      <button
        type="button"
        name="delete"
        className="hover:text-sky-700"
        onClick={removeHandler}
      >
        <DeleteOutlined fontSize="small" />
        <span className="sr-only">Remove</span>
      </button>
    </li>
  );
};
export default StepItem;
