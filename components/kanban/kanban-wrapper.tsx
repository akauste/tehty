"use client";
import { ToastProvider } from "@/context/toaster-context";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const KanbanWrapper = ({
  children,
}: {
  children: React.ReactElement[] | React.ReactElement;
}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ToastProvider>{children}</ToastProvider>
    </DndProvider>
  );
};
export default KanbanWrapper;
