import { VoteType } from "@prisma/client";
import { z } from "zod";

export const PostVotePayloadSchema = z.object({
  voteType: z.nativeEnum(VoteType),
});

export type PostVotePayload = z.infer<typeof PostVotePayloadSchema>;
