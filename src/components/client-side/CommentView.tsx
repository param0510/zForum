import { Comment } from "@prisma/client";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FC } from "react";
import UserAvatar from "../custom/UserAvatar";
import CommentReplyAction from "./CommentReplyAction";
import CommentVote from "./CommentVote";
import { db } from "@/lib/db";

interface CommentViewProps {
  comment: Comment & {
    author: {
      image: string | null;
    };
  };

  replies?: (Comment & {
    author: {
      image: string | null;
    };
  })[];
}

const CommentView = async ({ comment, replies }: CommentViewProps) => {
  const {
    authorId,
    createdAt,
    text,
    postId,
    id,
    replyToId,
    author: { image },
  } = comment;
  const votes = await db.commentVote.findMany({
    where: {
      commentId: id,
    },
  });
  return (
    <div className="flex items-start gap-5 p-3">
      <UserAvatar imgUrl={image ?? ""} className="h-9 w-9" />
      <div className="flex w-full flex-col gap-2">
        <div className="flex gap-2 text-sm">
          <span>u/{authorId}</span>
          <span>|</span>
          <span>{createdAt.getHours()} - hours ago</span>
        </div>
        <p>{text}</p>
        <div className="flex w-full items-center gap-5">
          {/* Vote Buttons */}
          <div className="flex scale-75 items-center justify-center gap-4">
            <CommentVote commentId={id} votes={votes} />
          </div>

          {/* (replyToId ?? id) makes sure that a replyToId is sent to the create comment box */}
          {/* Here we only implement level 1 sub divsions in comment replies. (Means there is only 1 sub-comment level and not more than that). So if the comment is already a reply to another comment we send the "replyToId" or else we send the comment's "id" itself */}
          <CommentReplyAction postId={postId} replyToId={replyToId ?? id} />
        </div>
        {replies?.map((reply) => (
          // @ts-expect-error server side component
          <CommentView comment={reply} key={reply.id} />
        ))}
      </div>
    </div>
  );
};

export default CommentView;
