"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/DropdownMenu";
import UserAvatar from "../custom/UserAvatar";
import { Session } from "next-auth";
import { FC } from "react";
import { signOut } from "next-auth/react";
import { Button } from "../custom/Button";

// props
interface UserAccountNavProps {
  session: Session | null | undefined;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ session }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar imgUrl={session?.user?.image ?? ""} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black/50 text-white">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Feed</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
