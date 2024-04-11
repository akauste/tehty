import { Toast, ToastContextType, ToastType, ToastUpdate } from "@/lib/types";
import React, { useState } from "react";

export const ToastContext = React.createContext<ToastContextType | null>(null);

let maxId = 1; // Just using regular var for id's
const timers: { [key: number]: NodeJS.Timeout } = {};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = ({
    type = "info",
    name,
    description = "",
    autoRemove,
  }: {
    type?: ToastType;
    name: string;
    description?: string;
    autoRemove?: number;
  }) => {
    const id = maxId;
    maxId++;
    setToasts((old) => [...old, { id, type, name, description }]);
    console.log("Added toast id:" + id);
    if (autoRemove)
      timers[id] = setTimeout(() => {
        clearToast(id);
      }, autoRemove);
    return id;
  };

  const updateValue = (oldValue: Toast, newValue: ToastUpdate) => {
    if (newValue.autoRemove) {
      if (timers[oldValue.id]) clearTimeout(timers[oldValue.id]);
      timers[oldValue.id] = setTimeout(
        () => clearToast(oldValue.id),
        newValue.autoRemove
      );
    }

    return { ...oldValue, ...newValue };
  };

  const updateToast = (
    id: number,
    newValue: {
      type?: ToastType;
      name?: string;
      description?: string;
      autoRemove?: number;
    }
  ) => {
    setToasts((old) =>
      old.map((v) => (v.id === id ? updateValue(v, newValue) : { ...v }))
    );
  };

  const clearToast = (id: number) => {
    delete timers[id];
    removeToast(id);
  };
  const removeToast = (id: number) => {
    setToasts((old) => old.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider
      value={{ toasts, addToast, updateToast, removeToast }}
    >
      {children}
    </ToastContext.Provider>
  );
};
