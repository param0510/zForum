"use client";
import { voteCounter } from "@/lib/utils";
import { CommentVote as CVote, VoteType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import VoteClient from "./VoteClient";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface CommentVoteProps {
  commentId: string;
}

const CommentVote: FC<CommentVoteProps> = ({ commentId }) => {
  // VOTE URL FOR THE API REQUEST
  const voteUrl = `/api/comment/${commentId}/vote`;

  const { data: session } = useSession();
  const [votes, setVotes] = useState<CVote[]>();

  const totalVoteEffect = votes ? voteCounter(votes.map((v) => v.type)) : 0;
  var currentUserVoteType: VoteType | undefined = undefined;
  if (session && votes) {
    const currentUserVote = votes.find((v) => v.userId === session.user.id);
    currentUserVoteType = currentUserVote?.type;
  }

  useEffect(() => {
    const getCommentVotes = async () => {
      try {
        const { data: commentVotes } = await axios.get<CVote[]>(voteUrl);
        setVotes(commentVotes);
      } catch (error) {
        console.log(error);
      }
    };
    getCommentVotes();
  }, []);

  return votes ? (
    <VoteClient
      totalVoteEffect={totalVoteEffect}
      voteUrl={voteUrl}
      currentUserVoteType={currentUserVoteType}
    />
  ) : (
    <Loader2 className="animate-spin" />
  );
};

export default CommentVote;
