"use client";
import { voteCounter } from "@/lib/utils";
import { PostVotePayload, PostVotePayloadSchema } from "@/lib/validators/vote";
import { PostVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, ThumbsDown, ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";

interface PostVoteClientProps {
  votes?: PostVote[]; // DONT get votes from the parent fetch it in here (make a choice between useEffect or useQuery)
  postId: string;
}
const PostVoteClient: FC<PostVoteClientProps> = ({ votes, postId }) => {
  // #REFRACTOR
  if (!votes) {
    return (
      <>
        <ThumbsUp className="cursor-pointer" />
        {0}
        <ThumbsDown className="cursor-pointer " />
      </>
    );
  }
  const [voteCount, setVoteCount] = useState<number>(0);
  const [activeVoteType, setActiveVoteType] = useState<VoteType | null>(null);
  const { data: session } = useSession();

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      // Check out the best practice to implement this
      // FIGURE OUT SOMETHING FOR THIS
      // if (activeVoteType === "DOWN") {
      //   if (voteType === "UP") {
      //     setActiveVoteType("UP");
      //     setVoteCount(voteCount + 2);
      //   } else {
      //     setActiveVoteType(null);
      //     setVoteCount(voteCount + 1);
      //   }
      // } else if (activeVoteType === "UP") {
      //   if (voteType === "UP") {
      //     setActiveVoteType(null);
      //     setVoteCount(voteCount -1);
      //   } else {
      //     setActiveVoteType("DOWN");
      //     setVoteCount(voteCount - 2);
      //   }
      // } else if (activeVoteType === null) {
      //   if (voteType === "UP") {
      //     setActiveVoteType("UP");
      //     setVoteCount(voteCount + 1);
      //   } else {
      //     setActiveVoteType("DOWN");
      //     setVoteCount(voteCount - 1);
      //   }
      // }
      const res = await axios.patch(`/api/post/${postId}/vote`, { voteType });
      return res;
    },
    onError(error, voteType) {
      // revert back on the state objects
      // toast for error message

      console.log(error);
    },
    onSuccess(data, voteType) {
      // do something
      if (activeVoteType === "DOWN") {
        if (voteType === "UP") {
          setActiveVoteType("UP");
          setVoteCount(voteCount + 2);
        } else {
          setActiveVoteType(null);
          setVoteCount(voteCount + 1);
        }
      } else if (activeVoteType === "UP") {
        if (voteType === "UP") {
          setActiveVoteType(null);
          setVoteCount(voteCount - 1);
        } else {
          setActiveVoteType("DOWN");
          setVoteCount(voteCount - 2);
        }
      } else if (activeVoteType === null) {
        if (voteType === "UP") {
          setActiveVoteType("UP");
          setVoteCount(voteCount + 1);
        } else {
          setActiveVoteType("DOWN");
          setVoteCount(voteCount - 1);
        }
      }
    },
  });

  // Initial render setup
  useEffect(() => {
    setVoteCount(voteCounter(votes.map((v) => v.type)));

    if (!session) {
      return;
    }
    const currentUserVote = votes.find((v) => v.userId === session.user.id);
    // console.log("votes", votes);
    // console.log("currentUserVote", currentUserVote);
    // console.log("session", session);

    if (currentUserVote?.type) {
      setActiveVoteType(currentUserVote.type);
    }
  }, [session]);

  return (
    <>
      <ThumbsUp
        onClick={() => vote("UP")}
        className={
          "cursor-pointer " +
          (activeVoteType === VoteType.UP && "fill-emerald-800")
        }
      />
      {isLoading ? <Loader2 className="animate-spin" /> : voteCount}
      <ThumbsDown
        onClick={() => vote("DOWN")}
        className={
          "cursor-pointer " +
          (activeVoteType === VoteType.DOWN && "fill-orange-800")
        }
      />
    </>
  );
};

export default PostVoteClient;
