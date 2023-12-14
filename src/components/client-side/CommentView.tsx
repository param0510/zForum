import { Comment } from "@prisma/client";
import UserAvatar from "../custom/UserAvatar";
import CommentReplyAction from "./CommentReplyAction";
import CommentVote from "./CommentVote";
import CommentList from "../server-side/CommentList";
import { CommentData } from "@/types/comment";

interface CommentViewProps {
  comment: CommentData;
  // No need for this anymore as we have implemented another way round - look at line 51 to learn more.
  // replies?: (Comment & {
  //   author: {
  //     image: string | null;
  //     username: string;
  //   };
  // })[];
}

const CommentView = ({ comment }: CommentViewProps) => {
  const {
    createdAt,
    text,
    postId,
    id,
    replyToId,
    author: { image, username: authorName },
  } = comment;
  return (
    <div className="flex items-start gap-5 p-3">
      <UserAvatar
        user={{ name: authorName, image: image }}
        className="h-9 w-9"
      />
      <div className="flex w-full flex-col gap-2">
        <div className="flex gap-2 text-sm">
          <span>u/{authorName}</span>
          <span>|</span>
          {/* @ts-ignore Unexpected type conversion from Date to string */}
          <span>{createdAt} - hours ago</span>
        </div>
        <p>{text}</p>
        <div className="flex w-full items-center gap-5">
          {/* Vote Buttons */}
          <CommentVote commentId={id} />

          {/* (replyToId ?? id) makes sure that a replyToId is sent to the create comment box */}
          {/* Here we only implement level 1 sub divsions in comment replies. (Means there is only 1 sub-comment level and not more than that). So if the comment is already a reply to another comment we send the "replyToId" or else we send the comment's "id" itself */}
          <CommentReplyAction postId={postId} replyToId={replyToId ?? id} />
        </div>

        {replyToId === null && <CommentList postId={postId} replyToId={id} />}
        {/* {replies?.map((reply) => (
          <CommentView comment={reply} key={reply.id} />
        ))} */}
      </div>
    </div>
  );
};

export default CommentView;
