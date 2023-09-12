import AvatarComp from "@/components/avatar";
import { ModeToggle } from "@/components/darkModebutton";
import { Button } from "@/components/ui/button";
import { LogOut, User2, Users2, Wallet } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DropDown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarComp />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/app/admin/profile">
          <DropdownMenuItem className="flex gap-2">
            <span>
              <User2 size={16} />
            </span>
            Profile
          </DropdownMenuItem>
        </Link>
        <Link href="/app/admin/billing">
          <DropdownMenuItem className="flex gap-2">
            <span>
              <Wallet size={16} />
            </span>
            Billing
          </DropdownMenuItem>
        </Link>
        <Link href="/app/admin/team">
          <DropdownMenuItem className="flex gap-2">
            <span>
              <Users2 size={16} />
            </span>
            Team
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/api/auth/signout">
          <DropdownMenuItem className="text-red-500 flex gap-2">
            <span>
              <LogOut size={16} />
            </span>
            Logout
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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
