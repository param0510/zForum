import { db } from "@/lib/db";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import PostList from "../client-side/PostList";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const GeneralFeed = async () => {
  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    // include: {
    //   votes: true,
    //   author: true,
    //   comments: true,
    //   community: true,
    // },
    include: {
      community: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
        },
      },
      comments: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS, // 4 to demonstrate infinite scroll, should be higher in production
  });

  return <PostList initialPosts={posts} />;
};

export default GeneralFeed;
