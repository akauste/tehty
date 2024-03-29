/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import { Login, Logout } from "@mui/icons-material";
import DarkModeSwitch from "@/components/header/dark-mode-switch";
import Link from "next/link";
import HeaderMainMenu from "@/components/header/main-menu";

//const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tehty",
  description: "Manage your tasks",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`{inter.className} bg-gradient-to-b from-gray-200 dark:from-gray-700 to-gray-50 dark:to-gray-900`}
      >
        <header className="text-gray-900 dark:text-gray-200 border-b border-green-200 dark:border-green-700 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex flex-row gap-2">
          <div className="p-2">
            <h1 className="text-green-800 font-bold text-2xl dark:text-green-300 mr-10 text-center w-full">
              Tehty
            </h1>
            <p className="text-xs text-center w-full text-slate-500 italic">
              manage your tasks
            </p>
          </div>

          <div className=" flex-grow"></div>
          <HeaderMainMenu />
          <div className=" flex-grow"></div>
          <div className="flex items-center gap-2">
            {/*session?.user && (
              <span className="p-2">
                
                {session.user.email}
              </span>
            )*/}
            {session?.user ? (
              <Link
                href="/api/auth/signout"
                className="py-1 px-2 border border-gray-700 rounded-lg bg-gray-600 dark:bg-gray-900 text-slate-200 hover:text-white text-xs"
              >
                <Logout /> Sign out
                {session.user.image && (
                  <img
                    src={session.user.image}
                    alt={`{session.user.email}`}
                    className="ml-2 w-6 inline-block rounded-md border border-slate-500"
                  />
                )}
              </Link>
            ) : (
              <Link
                href="/api/auth/signin"
                className="py-1 px-2 border border-gray-700 rounded-lg bg-gray-600 dark:bg-gray-900 text-slate-200 hover:text-white text-xs"
              >
                <Login /> Sign in
              </Link>
            )}
            <DarkModeSwitch />
          </div>
        </header>
        <main className="flex min-h-screen max-w-[1200px] flex-col items-center justify-between py-4 mx-auto">
          <div className="z-10 w-full text-sm p-4 bg-white dark:bg-gray-800 shadow-sm shadow-gray-400 dark:shadow-gray-950">
            {children}
          </div>
        </main>
        <footer className="text-center bg-slate-300 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
          &copy; 2024 &mdash; Aku Kauste
        </footer>
      </body>
    </html>
  );
}
