"use client";
import { PostVote, VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface VoteClientProps {
  totalVoteEffect: number;
  voteUrl: string;
  currentUserVoteType?: VoteType;
}
const VoteClient: FC<VoteClientProps> = ({
  totalVoteEffect,
  voteUrl,
  currentUserVoteType,
}) => {
  const [voteCount, setVoteCount] = useState<number>(totalVoteEffect);
  const [activeVoteType, setActiveVoteType] = useState<VoteType | undefined>(
    currentUserVoteType,
  );
  const router = useRouter();

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async ({
      voteType,
      previousVoteType,
    }: {
      voteType: VoteType;
      previousVoteType: VoteType | undefined;
    }) => {
      // Check out the best practice to implement this
      if (previousVoteType === "DOWN") {
        if (voteType === "UP") {
          setActiveVoteType("UP");
          setVoteCount(voteCount + 2);
        } else {
          setActiveVoteType(undefined);
          setVoteCount(voteCount + 1);
        }
      } else if (previousVoteType === "UP") {
        if (voteType === "UP") {
          setActiveVoteType(undefined);
          setVoteCount(voteCount - 1);
        } else {
          setActiveVoteType("DOWN");
          setVoteCount(voteCount - 2);
        }
      } else if (previousVoteType === undefined) {
        if (voteType === "UP") {
          setActiveVoteType("UP");
          setVoteCount(voteCount + 1);
        } else {
          setActiveVoteType("DOWN");
          setVoteCount(voteCount - 1);
        }
      }
      const res = await axios.patch(voteUrl, { voteType });
      return res;
    },
    onError(error, { voteType, previousVoteType }) {
      // toast for error message - IMPORTANT
      // revert back on the state objects

      // NO NEED FOR THIS
      // if (previousVoteType === "DOWN") {
      //   if (voteType === "UP") {
      //     setActiveVoteType("DOWN");
      //     setVoteCount(voteCount - 2);
      //   } else {
      //     setActiveVoteType("DOWN");
      //     setVoteCount(voteCount - 1);
      //   }
      // } else if (previousVoteType === "UP") {
      //   setActiveVoteType("UP");
      //   if (voteType === "UP") {
      //     setVoteCount(voteCount + 1);
      //   } else {
      //     setVoteCount(voteCount + 2);
      //   }
      // } else if (previousVoteType === undefined) {
      //   setActiveVoteType(undefined);
      //   if (voteType === "UP") {
      //     setVoteCount(voteCount - 1);
      //   } else {
      //     setVoteCount(voteCount + 1);
      //   }
      // }

      console.log(error);
    },
    onSuccess(data, { voteType, previousVoteType }) {
      // do something
      // if (activeVoteType === "DOWN") {
      //   if (voteType === "UP") {
      //     setActiveVoteType("UP");
      //     setVoteCount(voteCount + 2);
      //   } else {
      //     setActiveVoteType(undefined);
      //     setVoteCount(voteCount + 1);
      //   }
      // } else if (activeVoteType === "UP") {
      //   if (voteType === "UP") {
      //     setActiveVoteType(undefined);
      //     setVoteCount(voteCount - 1);
      //   } else {
      //     setActiveVoteType("DOWN");
      //     setVoteCount(voteCount - 2);
      //   }
      // } else if (activeVoteType === undefined) {
      //   if (voteType === "UP") {
      //     setActiveVoteType("UP");
      //     setVoteCount(voteCount + 1);
      //   } else {
      //     setActiveVoteType("DOWN");
      //     setVoteCount(voteCount - 1);
      //   }
      // }
    },
    onSettled() {
      router.refresh();
    },
  });

  // Initial render setup
  useEffect(() => {
    setActiveVoteType(currentUserVoteType);
    setVoteCount(totalVoteEffect);
  }, [currentUserVoteType, totalVoteEffect]);

  return (
    <>
      <button
        disabled={isLoading}
        onClick={() =>
          vote({ voteType: "UP", previousVoteType: activeVoteType })
        }
        className="cursor-pointer"
      >
        <ThumbsUp
          className={activeVoteType === VoteType.UP ? "fill-emerald-800" : ""}
        />
      </button>
      {/* {isLoading ? <Loader2 className="animate-spin" /> : voteCount} */}
      {voteCount}
      <button
        disabled={isLoading}
        onClick={() =>
          vote({ voteType: "DOWN", previousVoteType: activeVoteType })
        }
        className="cursor-pointer"
      >
        <ThumbsDown
          className={activeVoteType === VoteType.DOWN ? "fill-orange-800" : ""}
        />
      </button>
    </>
  );
};

export default VoteClient;
