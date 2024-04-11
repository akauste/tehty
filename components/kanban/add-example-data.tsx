"use client";

import { ToastContext } from "@/context/toaster-context";
import { KanbanActions } from "@/lib/kanban-reducer";
import { ToastContextType } from "@/lib/types";
import { Dispatch, useContext } from "react";

interface AddExampleDataProps {
  dispatch: Dispatch<KanbanActions>;
}

const AddExampleData = ({ dispatch }: AddExampleDataProps) => {
  const { addToast, updateToast } = useContext(
    ToastContext
  ) as ToastContextType;
  const createData = () => {
    const toastId = addToast({ name: "Adding example data" });
    fetch("/api/examples/", { method: "POST" })
      .then((res) => res.json())
      .then((boards) => {
        dispatch({ type: "replace-boards", boards });
        updateToast(toastId, {
          type: "success",
          description: "Example created, updating view.",
          autoRemove: 300,
        });
      })
      .catch((err) =>
        updateToast(toastId, {
          type: "error",
          description: "Failed to create example data. Error: " + err.message,
        })
      );
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
