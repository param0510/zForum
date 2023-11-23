import { AvatarProps } from "@radix-ui/react-avatar";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn-ui/Avatar";

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
