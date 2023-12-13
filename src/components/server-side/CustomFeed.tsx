import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PostList from "../client-side/PostList";

const CustomFeed = async () => {
  const session = await getServerAuthSession();

  // only rendered if session exists, so this will not happen
  if (!session) return notFound();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      community: true,
    },
  });

  const posts = await db.post.findMany({
    where: {
      community: {
        name: {
          in: followedCommunities.map((fc) => fc.community.name),
        },
      },
    },
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
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  return <PostList initialPosts={posts} />;
};

export default CustomFeed;
