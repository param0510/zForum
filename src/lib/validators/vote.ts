import { VoteType } from "@prisma/client";
import { z } from "zod";

export const VotePayloadSchema = z.object({
  voteType: z.nativeEnum(VoteType),
});

export type VotePayload = z.infer<typeof VotePayloadSchema>;
