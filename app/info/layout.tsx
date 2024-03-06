import Link from "next/link";

export default function InfoLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <div className="flex flex-row space-x-5">
    <ul className="border-r-2 w-1/4 border-gray-400 pr-4">
      <li><Link href="/info">Info page</Link></li>
      <li><Link href="/info/sub">Sub page</Link></li>
    </ul>
    <div>
      {children}
    </div>
  </div>
}