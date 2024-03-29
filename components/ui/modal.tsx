import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

type ModalProps = PropsWithChildren<{ close: () => void }>;

const Modal = ({ children, close }: ModalProps) => {
  return createPortal(
    <>
      <div
        data-testid="backdrop"
        className="fixed left-0 top-0 right-0 bottom-0 bg-black opacity-10 z-50 blur-xl"
        onClick={close}
      ></div>
      <div
        data-testid="modal"
        className="modal z-50 min-w-80 min-h-32 bg-white dark:bg-black p-4"
      >
        {children}
      </div>
    </>,
    document.body
  );
};
export default Modal;
