import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User2, Users2, Wallet } from "lucide-react";
import Link from "next/link";
import AvatarComp from "./Avatar";

export default async function DropDown() {
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
