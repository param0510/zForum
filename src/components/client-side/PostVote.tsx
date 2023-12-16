"use client";
import { voteCounter } from "@/lib/utils";
import { PostVote as PVote, VoteType } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import VoteClientShell from "../custom/VoteClientShell";
import VoteClient from "./VoteClient";

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

  return (
    <>
      {votes ? (
        <div className="flex flex-col gap-4 pb-4 pr-6 sm:w-20 sm:gap-0 sm:pb-0">
          <VoteClient
            totalVoteEffect={totalVoteEffect}
            voteUrl={voteUrl}
            currentUserVoteType={currentUserVoteType}
          />
        </div>
      ) : (
        <div className="flex w-20 flex-col items-center pr-6">
          <VoteClientShell />
        </div>
      )}
    </>
  );
};

export default PostVote;
