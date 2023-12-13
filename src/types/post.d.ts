import { Comment, Post, User } from "@prisma/client";

export type ExtendedPost = Post & {
  community: {
    name: string;
  };
  author: {
    username: string | null;
  };
  comments: Comment[];
};
