"use client";
import { voteCounter } from "@/lib/utils";
import { PostVote, VoteType } from "@prisma/client";
import { useSession } from "next-auth/react";
import { FC } from "react";
import VoteClient from "./VoteClient";

interface PostVoteProps {
  votes: PostVote[];
  postId: string;
}

const PostVote: FC<PostVoteProps> = ({ votes, postId }) => {
  const { data: session } = useSession();
  const voteUrl = `/api/post/${postId}/vote`;
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

export default PostVote;
