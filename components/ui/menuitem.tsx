import { PropsWithChildren } from "react";

type MenuItemProps = PropsWithChildren<{
  onClick: () => void;
  disabled?: boolean;
}>;

const MenuItem = ({ onClick, children, disabled = false }: MenuItemProps) => {
  return (
    <li>
      <button
        disabled={disabled}
        onClick={onClick}
        className="w-full text-left disabled:text-slate-600 disabled:bg-slate-200 disabled:dark:bg-slate-800 hover:text-sky-800 dark:hover:text-sky-200 hover:bg-white dark:hover:bg-slate-900 disabled:hover:bg-slate-100 dark:disabled:hover:bg-slate-800"
      >
        {children}
      </button>
    </li>
  );
};
export default MenuItem;
