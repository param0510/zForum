import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import PostList from "../client-side/PostList";
import { Info } from "lucide-react";

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

  return posts.length ? (
    <PostList initialPosts={posts} />
  ) : (
    // If user hasn't followed or created any communities
    <div
      className="col-span-2 flex items-center rounded-lg bg-slate-400/40 p-6 text-black"
      role="alert"
    >
      <div className="mr-4">
        <Info className="fill-urrent h-10 w-10 text-current" />
      </div>
      <div>
        <p className="mb-2 text-lg font-semibold">Feed Inactive!</p>
        <p className="text-sm">
          Looks like you haven't{" "}
          <strong className="font-semibold">followed</strong> or{" "}
          <strong className="font-semibold">created</strong> any communities!
          Feel free to participate and contribute to ForumZ.
        </p>
      </div>
    </div>
  );
};

export default CustomFeed;
