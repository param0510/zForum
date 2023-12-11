"use client";
import { voteCounter } from "@/lib/utils";
import { PostVote as PVote, VoteType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import VoteClient from "./VoteClient";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface PostVoteProps {
  postId: string;
}

const PostVote: FC<PostVoteProps> = ({ postId }) => {
  // VOTE URL FOR THE API REQUEST
  const voteUrl = `/api/post/${postId}/vote`;

  const { data: session } = useSession();
  const [votes, setVotes] = useState<PVote[]>();

  const totalVoteEffect = votes ? voteCounter(votes.map((v) => v.type)) : 0;
  var currentUserVoteType: VoteType | undefined = undefined;
  if (session && votes) {
    const currentUserVote = votes.find((v) => v.userId === session.user.id);
    currentUserVoteType = currentUserVote?.type;
  }

  useEffect(() => {
    const getPostVotes = async () => {
      try {
        const { data: postVotes } = await axios.get<PVote[]>(voteUrl);
        setVotes(postVotes);
      } catch (error) {
        console.log(error);
      }
    };
    getPostVotes();
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

export default PostVote;
