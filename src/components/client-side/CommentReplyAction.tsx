"use client";
import { Reply } from "lucide-react";
import { FC, useState } from "react";
import CreateComment from "./CreateComment";

interface CommentReplyActionProps {
  postId: string;
  replyToId: string;
}

const CommentReplyAction: FC<CommentReplyActionProps> = ({
  postId,
  replyToId,
}) => {
  const [replyMode, setReplyMode] = useState<boolean>(false);

  if (!replyMode) {
    //  Reply button will enable reply mode
    return (
      <Reply
        size={20}
        onClick={() => setReplyMode(true)}
        className="cursor-pointer"
      />
    );
  }

  return (
    <>
      <CreateComment
        postId={postId}
        replyToId={replyToId}
        setReplyMode={setReplyMode}
      />
    </>
  );
};

export default CommentReplyAction;
