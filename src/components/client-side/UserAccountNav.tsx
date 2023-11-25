"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/DropdownMenu";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { FC } from "react";
import UserAvatar from "../custom/UserAvatar";
import Link from "next/link";

// props
interface UserAccountNavProps {
  session: Session | null | undefined;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ session }) => {
  // console.log("session", session);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar imgUrl={session?.user?.image ?? ""} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black/50 text-white">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/c/create">Create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/sign-in`,
            });
          }}
          className="cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
