import { z } from "zod";

export const UpdateUserPayloadSchema = z.object({
  // id: z.string().nonempty(),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-zA-Z0-9_]+$/),
});

export type UpdateUserPayload = z.infer<typeof UpdateUserPayloadSchema>;
