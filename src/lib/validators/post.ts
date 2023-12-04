import z from "zod";

export const CreatePostPayloadSchema = z.object({
  title: z.string().min(2).max(21),
  // content: z.any().nullable()
  content: z.object({
    time: z.number(),
    version: z.string(),
    blocks: z.array(z.any()).nonempty("Content is required to make a post"),
  }),
  communityId: z.string(),
  creatorId: z.string(),
});

export type CreatePostPayload = z.infer<typeof CreatePostPayloadSchema>;

export const GetPostsPayloadSchema = z.object({
  communityId: z.union([z.string(), z.undefined()]),
});

export type GetPostsPayload = z.infer<typeof GetPostsPayloadSchema>;
