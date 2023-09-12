import { ModeToggle } from "@/components/darkModebutton";
import DropDown from "@/components/dropdown";
import Link from "next/link";
import { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
  return (
    <main className="w-screen min-h-screen">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4">
        <Link href="/">
          <span className="text-2xl font-black">HWM</span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <DropDown />
        </div>
      </div>
      {children}
    </main>
  );
}
