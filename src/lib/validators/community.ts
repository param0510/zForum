import { z } from "zod";

export const CreateCommunityPayloadSchema = z.object({
  name: z.string().min(3).max(26),
});

export type CreateCommunityPayload = z.infer<
  typeof CreateCommunityPayloadSchema
>;
