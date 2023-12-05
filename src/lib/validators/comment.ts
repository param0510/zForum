import { z } from "zod";

export const CreateCommentPayloadSchema = z.object({
  text: z.string().nonempty(),
  replyToId: z.union([z.string(), z.undefined()]),
});

export type CreateCommentPayload = z.infer<typeof CreateCommentPayloadSchema>;
