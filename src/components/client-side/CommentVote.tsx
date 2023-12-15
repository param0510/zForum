"use client";
import { cn, voteCounter } from "@/lib/utils";
import { CommentVote as CVote, VoteType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import VoteClient from "./VoteClient";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Animations from "../custom/Animations";

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
