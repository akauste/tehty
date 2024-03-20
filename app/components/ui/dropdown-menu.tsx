import { MoreVert } from "@mui/icons-material";
import { PropsWithChildren, useState } from "react";

type DropdownMenuProps = PropsWithChildren<{
  buttonContent?: string | JSX.Element;
}>;

const DropdownMenu = ({
  children,
  buttonContent = <MoreVert fontSize="small" />,
}: DropdownMenuProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu((v) => !v);

  return (
    <div>
      <button onClick={toggleMenu}>{buttonContent}</button>
      {showMenu && (
        <>
          <div
            className="absolute left-0 top-0 right-0 bottom-0"
            onClick={() => setShowMenu(false)}
          />
          <div className="relative">
            <ul
              className="absolute w-36 -right-1 top-1 border border-slate-600 bg-slate-100 origin-top-right z-10 dark:bg-black shadow-md"
              onClick={() => setShowMenu(false)}
            >
              {children}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
export default DropdownMenu;
