"use client";

import { Image as ImageIcon, Link2 } from "lucide-react";
import { FC } from "react";
import type { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import UserAvatar from "../custom/UserAvatar";
import { Input } from "../shadcn-ui/Input";
import { Button } from "../custom/Button";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();
  const redirectRoute = pathname + "/post/create";

  return (
    <li className="overflow-hidden rounded-md bg-white shadow">
      <div className="flex h-full justify-between gap-6 px-6 py-4">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user.image || null,
            }}
          />

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 outline outline-2 outline-white" />
        </div>
        <Input
          onClick={() => router.push(redirectRoute)}
          readOnly
          placeholder="Create post"
        />
        <Button onClick={() => router.push(redirectRoute)} variant="ghost">
          <ImageIcon className="text-zinc-600" />
        </Button>
        <Button onClick={() => router.push(redirectRoute)} variant="ghost">
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
