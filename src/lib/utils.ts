import { VoteType } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function voteCounter(votes: VoteType[]): number {
  return votes.reduce(
    (acc, currentVal) => (currentVal === VoteType.UP ? acc + 1 : acc - 1),
    0,
  );
}
