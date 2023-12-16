"use client";
import { CommentVote as CVote } from "@prisma/client";
import { FC } from "react";
import VoteClient from "./VoteClient";

interface CommentVoteProps {
  commentId: string;
  votesAmt: number;
  currentVote: CVote | undefined;
}

const CommentVote: FC<CommentVoteProps> = ({
  commentId,
  votesAmt,
  currentVote,
}) => {
  // VOTE URL FOR THE API REQUEST
  const voteUrl = `/api/comment/${commentId}/vote`;

  return (
    <div className="flex gap-1">
      <VoteClient
        totalVoteEffect={votesAmt}
        voteUrl={voteUrl}
        currentUserVoteType={currentVote?.type}
      />
    </div>
  );
};

export default CommentVote;
