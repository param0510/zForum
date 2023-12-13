"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/shadcn-ui/DropdownMenu";
import { User } from "@prisma/client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";
import UserAvatar from "../custom/UserAvatar";

// props
interface UserAccountNavProps {
  // session: Session | null;
  user: Pick<User, "email" | "name" | "image">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{
            name: user.name || null,
            image: user.image || null,
          }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-white">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && <p className="font-medium">{user.name}</p>}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {/* <DropdownMenuLabel>Options</DropdownMenuLabel> */}
        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/c/create">Create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
