"use client";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn-ui/Avatar";
import { signOut } from "next-auth/react";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  imgUrl: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ imgUrl, ...props }) => {
  return (
    <Avatar {...props}>
      <AvatarImage src={imgUrl} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
