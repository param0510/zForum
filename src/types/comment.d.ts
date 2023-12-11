import { Comment } from "@prisma/client";

export type CommentData = Comment & {
  author: {
    image: string | null;
    username: string;
  };
};
