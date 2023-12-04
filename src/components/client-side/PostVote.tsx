import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FC } from "react";

interface PostVoteProps {}

const PostVote: FC<PostVoteProps> = ({}) => {
  return (
    <>
      <ThumbsUp className="cursor-pointer fill-orange-800" />
      {0}
      <ThumbsDown className="cursor-pointer " />
    </>
  );
};

export default PostVote;
