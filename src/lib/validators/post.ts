import z from "zod";

export const CreatePostPayloadSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
  content: z.object({
    time: z.number(),
    version: z.string(),
    blocks: z.array(z.any()).nonempty("Content is required to make a post"),
  }),
  communityId: z.string().nonempty(),
});

export type CreatePostPayload = z.infer<typeof CreatePostPayloadSchema>;

export const PostTitleValidationSchema = z.object({
  title: z
    .string()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(128, {
      message: "Title must be less than 128 characters long",
    }),
});

export type PostTitleValidation = z.infer<typeof PostTitleValidationSchema>;

// export const GetPostsPayloadSchema = z.object({
//   communityId: z.union([z.string().nonempty(), z.undefined()]),
// });

// export type GetPostsPayload = z.infer<typeof GetPostsPayloadSchema>;
