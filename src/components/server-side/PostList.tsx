import { Post } from "@prisma/client";
import { Session } from "next-auth";
import { FC } from "react";

interface PostListProps {
  posts: Post[];
  session: Session | null;
}

const PostList: FC<PostListProps> = ({ posts }) => {
  return <div>Posts</div>;
};

export default PostList;
