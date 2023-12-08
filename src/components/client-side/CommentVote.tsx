"use client";
import { voteCounter } from "@/lib/utils";
import { CommentVote, VoteType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { FC } from "react";
import VoteClient from "./VoteClient";

interface CommentVoteProps {
  votes: CommentVote[];
  commentId: string;
}

const CommentVote: FC<CommentVoteProps> = ({ votes, commentId }) => {
  const { data: session } = useSession();
  const voteUrl = `/api/comment/${commentId}/vote`;
  const totalVoteEffect = voteCounter(votes.map((v) => v.type));
  var currentUserVoteType: VoteType | undefined = undefined;
  if (session) {
    const currentUserVote = votes.find((v) => v.userId === session.user.id);
    currentUserVoteType = currentUserVote?.type;
  }
  return (
    <VoteClient
      totalVoteEffect={totalVoteEffect}
      voteUrl={voteUrl}
      currentUserVoteType={currentUserVoteType}
    />
  );
};

export default CommentVote;
