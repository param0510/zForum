import { Post } from "@prisma/client";
import { Session } from "next-auth";
import { FC } from "react";
import PostView from "../client-side/PostView";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

interface PostListProps {
  posts: Post[];
  slug: string;
  session: Session | null;
}

const PostList: FC<PostListProps> = ({ posts, slug }) => {
  // const { isLoading, data: posts } = useQuery<Post[]>({
  //   queryKey: [communityId, "posts"],
  //   queryFn: async () => {
  //     try {
  //       const { data } = await axios.get<Post[]>("/api/post", {
  //         data: communityId,
  //       });
  //       return data;
  //     } catch (error) {
  //       console.log(error);
  //       throw new Error("Error fetching data from the server");
  //     }
  //   },
  // });
  return (
    <div>
      <div className="flex flex-col gap-5">
        {posts?.map((post) => (
          // @ts-expect-error ssr component
          <PostView post={post} communityNameSlug={slug} key={post.id} />
        ))}
      </div>
    </div>
  );
};

export default PostList;
