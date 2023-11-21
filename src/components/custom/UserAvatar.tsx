import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn-ui/Avatar";

interface UserAvatarProps {
  imgUrl: string;
}

const UserAvatar: FC<UserAvatarProps> = ({ imgUrl }) => {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
