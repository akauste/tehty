"use client";
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function HeaderMainMenu() {
  const path = usePathname();
  return <ul className="flex">
    <li>
      <Link  href="/" className={`${path == '/' && 'font-bold'} p-2 mr-6`}>Home</Link>
    </li>
    <li>
      <Link  href="/kanban" className={`${path == '/kanban' && 'font-bold'} p-2 mr-6`}>Kanban</Link>
    </li>
    <li>
      <Link href="/info" className={`${path.match('/info') && 'font-bold'} p-2 mr-6`}>Info</Link>
    </li>
  </ul>
}