import { Dispatch, SetStateAction, useRef, useState } from "react";
import StepItem from "./step-item";
import { AddOutlined } from "@mui/icons-material";

export type Step = {
  idx: number;
  name: string;
  done: boolean;
};

interface StepsProps {
  steps: Step[];
  setSteps: Dispatch<SetStateAction<Step[]>>;
}

const Steps = ({ steps, setSteps }: StepsProps) => {
  const itemsRef: React.Ref<{ [key: number]: HTMLInputElement }> = useRef({});
  const [nextIdx, setNextIdx] = useState(steps.length);

  const updateStep = (idx: number, name: string, done: boolean) => {
    setSteps((steps) => {
      const newSteps = steps
        .map((s) => ({ ...s }))
        .map((s) => (s.idx === idx ? { idx, name, done } : { ...s }));

      return newSteps;
    });
  };
  const deleteStep = (idx: number) => {
    delete itemsRef.current![idx];
    setSteps((steps) =>
      steps.filter((s) => s.idx !== idx).map((s) => ({ ...s }))
    );
  };

  const prevStep = (idx: number) => {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].idx === idx) {
        if (i > 0 && itemsRef.current) {
          itemsRef.current[steps[i - 1].idx].focus();
        } else {
          // Do nothing, we are at first row
        }
        return;
      }
    }
  };

  const nextStep = (idx: number) => {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].idx === idx) {
        if (i < steps.length - 1 && itemsRef.current) {
          itemsRef.current[steps[i + 1].idx].focus();
        } else {
          createStepAndFocus();
        }
        return;
      }
    }
  };

  const createStepAndFocus = () => {
    const id = nextIdx;
    setSteps((steps) => [
      ...steps.map((s) => ({ ...s })),
      { idx: id, name: "", done: false },
    ]);
    setNextIdx((i) => i + 1);
    setTimeout(() => {
      itemsRef?.current![id]?.focus();
    }, 3);
  };

  const stepsDone = steps.reduce(
    (val: number, s) => (s.done ? val + 1 : val),
    0
  );

  return (
    <>
      <div className="flex gap-2">
        <label className="flex-grow">Steps</label>
        <progress value={stepsDone} max={steps.length}>
          {stepsDone}/{steps.length}
        </progress>
      </div>
      <ul className="space-y-1">
        {steps.map((step) => (
          <StepItem
            key={step.idx}
            index={step.idx}
            name={step.name}
            done={step.done}
            update={updateStep}
            remove={deleteStep}
            inputRef={(el) => (itemsRef.current![step.idx] = el)}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        ))}
        <li>
          <button
            type="button"
            className="border border-sky-200 rounded px-2"
            onClick={createStepAndFocus}
          >
            <AddOutlined fontSize="small" /> Add step
          </button>
        </li>
      </ul>
    </>
  );
};
export default Steps;
