import { Post } from "@prisma/client";
import { Session } from "next-auth";
import { FC } from "react";

interface PostsProps {
  posts: Post[];
  session: Session | null;
}

const Posts: FC<PostsProps> = ({ posts }) => {
  return <div>Posts</div>;
};

export default Posts;
