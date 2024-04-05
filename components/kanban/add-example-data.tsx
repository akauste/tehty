"use client";

import { KanbanActions } from "@/lib/kanban-reducer";
import { Dispatch } from "react";

interface AddExampleDataProps {
  dispatch: Dispatch<KanbanActions>;
}

const AddExampleData = ({ dispatch }: AddExampleDataProps) => {
  const createData = () => {
    fetch("/api/examples/", { method: "POST" })
      .then((res) => res.json())
      .then((boards) => dispatch({ type: "replace-boards", boards }));
  };
  return (
    <button
      onClick={createData}
      className="p-2 bg-green-200 border border-green-800 rounded"
    >
      Create example data
    </button>
  );
};
export default AddExampleData;
