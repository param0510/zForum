import { CreatePost } from "@/components/client-side/CreatePost";
import { buttonVariants } from "@/components/custom/Button";
import CommunityDetails from "@/components/server-side/CommunityDetails";
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
    include: {
      posts: true,
    },
  });
  if (!communityDetails) {
    return notFound();
  }
  // console.log(communityDetails);

  return (
    <>
      <h1 className="mb-6 text-5xl">{slug}</h1>
      <Link href={`/c/view/${slug}/post/create`} className={buttonVariants()}>
        Create Post
      </Link>
      {/* Post List */}
      <PostList posts={communityDetails.posts} session={session} />
    </>
  );
};

export default CommunityViewPage;
