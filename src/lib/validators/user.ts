import { z } from "zod";

export const UpdateUserPayloadSchema = z.object({
  id: z.string().nonempty(),
  username: z.string().nonempty(),
});

export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;
