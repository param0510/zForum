import MiniCreatePost from "@/components/client-side/MiniCreatePost";
import PostList from "@/components/client-side/PostList";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface CommunityViewPageProps {
  params: {
    slug: string;
  };
}
const CommunityViewPage = async ({
  params: { slug },
}: CommunityViewPageProps) => {
  const session = await getServerAuthSession();
  const communityDetails = await db.community.findUnique({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          comments: true,
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
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });

  if (!communityDetails) {
    return notFound();
  }

  return (
    <>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">
        c/{communityDetails.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostList
        initialPosts={communityDetails.posts}
        communityId={communityDetails.id}
      />
    </>
  );
};

export default CommunityViewPage;
