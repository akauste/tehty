import { ToastContext } from "@/context/toaster-context";
import { ToastContextType, ToastType } from "@/lib/types";
import { CloseOutlined } from "@mui/icons-material";
import React, { PropsWithChildren, useContext, useState } from "react";
import { createPortal } from "react-dom";

const Toaster = () => {
  const { toasts, removeToast } = useContext(ToastContext) as ToastContextType;

  const displayToasts = toasts.filter((t) => t.type !== "debug");

  return (
    <>
      <div
        data-testid="toaster"
        className="fixed right-4 bottom-4 z-50 space-y-4"
      >
        {displayToasts.map((t) => (
          <Toast
            key={t.id}
            type={t.type}
            name={t.name}
            description={t.description || ""}
            close={() => removeToast(t.id)}
          />
        ))}
      </div>
    </>
  );
};
export default Toaster;

type ToastProps = PropsWithChildren<{
  type: ToastType;
  name: string;
  description: string;
  close: () => void;
}>;

const Toast = ({ type, name, description, close }: ToastProps) => {
  return (
    <div
      className={`border toast ${type} border-slate-400 shadow-md rounded opacity-90`}
      onClick={close}
    >
      <h3 className={`border-b border-slate-400 p-2 font-medium`}>
        <button onClick={close} className="float-right">
          <CloseOutlined fontSize="small" />
        </button>
        {name}
      </h3>
      {description.length ? <p className={`p-2`}>{description}</p> : null}
    </div>
  );
};
