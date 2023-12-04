import { buttonVariants } from "@/components/custom/Button";
import PostList from "@/components/server-side/PostList";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
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
    select: {
      posts: true,
      subscribers: true,
      creatorId: true,
    },
  });
  if (!communityDetails) {
    return notFound();
  }

  const isUserSubscribed = !!communityDetails.subscribers.find(
    (sub) => sub.userId === session?.user.id,
  );
  const isUserCreator = communityDetails.creatorId === session?.user.id;
  return (
    <>
      <h1 className="mb-6 text-5xl">{slug}</h1>
      {(isUserSubscribed || isUserCreator) && (
        <Link href={`/c/view/${slug}/post/create`} className={buttonVariants()}>
          Create Post
        </Link>
      )}
      {/* Post List */}
      <PostList posts={communityDetails.posts} session={session} />
    </>
  );
};

export default CommunityViewPage;
