"use client";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Button } from "../custom/Button";

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
  const previousVoteType = usePrevious(currentUserVoteType);
  const { loginToast } = useCustomToasts();

  const { mutate: vote } = useMutation({
    onMutate(voteType) {
      if (activeVoteType === voteType) {
        // User is voting the same way again, so remove their vote
        setActiveVoteType(undefined);
        if (voteType === "UP") setVoteCount((prev) => prev - 1);
        else if (voteType === "DOWN") setVoteCount((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setActiveVoteType(voteType);
        if (voteType === "UP")
          setVoteCount((prev) => prev + (activeVoteType ? 2 : 1));
        else if (voteType === "DOWN")
          setVoteCount((prev) => prev - (activeVoteType ? 2 : 1));
      }
    },
    mutationFn: async (voteType: VoteType) => {
      return await axios.patch(voteUrl, { voteType });
    },
    onError: (err, voteType) => {
      if (previousVoteType) {
        if (voteType === "UP")
          setVoteCount((curr) =>
            previousVoteType === "UP" ? curr + 1 : curr - 2,
          );
        else
          setVoteCount((curr) =>
            previousVoteType === "DOWN" ? curr - 1 : curr + 2,
          );
      } else {
        if (voteType === "UP") setVoteCount((prev) => prev - 1);
        else setVoteCount((prev) => prev + 1);
      }

      // reset current vote
      setActiveVoteType(previousVoteType);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your vote was not registered. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Initial render setup
  useEffect(() => {
    setActiveVoteType(currentUserVoteType);
    setVoteCount(totalVoteEffect);
  }, [currentUserVoteType, totalVoteEffect]);

  return (
    <>
      {/* upvote */}
      <Button
        onClick={() => vote("UP")}
        size="sm"
        variant="ghost"
        aria-label="upvote"
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "fill-emerald-500 text-emerald-500": activeVoteType === "UP",
          })}
        />
      </Button>

      {/* score */}
      <p className="py-2 text-center text-sm font-medium text-zinc-900">
        {voteCount}
      </p>

      {/* downvote */}
      <Button
        onClick={() => vote("DOWN")}
        size="sm"
        className={cn({
          "text-emerald-500": activeVoteType === "DOWN",
        })}
        variant="ghost"
        aria-label="downvote"
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "fill-red-500 text-red-500": activeVoteType === "DOWN",
          })}
        />
      </Button>
    </>
  );
};

export default VoteClient;
