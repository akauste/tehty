"use client";
import {
  HelpOutlined,
  HomeOutlined,
  InfoOutlined,
  TaskOutlined,
  ViewKanbanOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HeaderMainMenu() {
  const path = usePathname();
  return (
    <ul className="flex items-center gap-6 px-4">
      <li>
        <Link
          href="/"
          className={`${
            path == "/" && "font-bold"
          } hover:text-green-800 dark:hover:text-slate-300`}
        >
          <HomeOutlined fontSize="small" className={`mr-1`} />
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/todo"
          className={`${
            path == "/todo" && "font-bold"
          } hover:text-green-800 dark:hover:text-slate-300`}
        >
          <TaskOutlined fontSize="small" className="mr-1" />
          Todo
        </Link>
      </li>
      <li>
        <Link
          href="/kanban"
          className={`${
            path == "/kanban" && "font-bold"
          } hover:text-green-800 dark:hover:text-slate-300`}
        >
          <ViewKanbanOutlined fontSize="small" className="mr-1" />
          Kanban
        </Link>
      </li>
      <li>
        <Link
          href="/help"
          className={`${
            path.match("/help") && "font-bold"
          } hover:text-green-800 dark:hover:text-slate-300`}
        >
          <HelpOutlined fontSize="small" className="mr-1" />
          Help
        </Link>
      </li>
    </ul>
  );
}
