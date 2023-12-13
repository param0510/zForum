import { buttonVariants } from "@/components/custom/Button";
import PostList from "@/components/client-side/PostList";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";

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
    select: {
      subscribers: true,
      // creatorId: true,
      id: true,
    },
  });

  if (!communityDetails) {
    return notFound();
  }
  const posts = await db.post.findMany({
    where: {
      communityId: communityDetails.id,
    },
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
    orderBy: {
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  });

  const isUserSubscribed = !!communityDetails.subscribers.find(
    (sub) => sub.userId === session?.user.id,
  );
  // const isUserCreator = communityDetails.creatorId === session?.user.id;
  return (
    <>
      <h1 className="mb-6 text-5xl">{slug}</h1>
      {isUserSubscribed && (
        <Link href={`/c/view/${slug}/post/create`} className={buttonVariants()}>
          Create Post
        </Link>
      )}
      {/* Post List */}
      <PostList communityId={communityDetails.id} initialPosts={posts} />
    </>
  );
};

export default CommunityViewPage;
