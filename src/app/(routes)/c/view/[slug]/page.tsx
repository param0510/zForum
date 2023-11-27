import { CreatePost } from "@/components/client-side/CreatePost";
import { Button } from "@/components/custom/Button";
import CommunityDetails from "@/components/server-side/CommunityDetails";
import Posts from "@/components/server-side/Posts";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import axios from "axios";
import { notFound } from "next/navigation";
import { FC } from "react";

interface PageProps {
  params: {
    slug: string;
  };
}
const CommunityViewPage = async ({ params: { slug } }: PageProps) => {
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
      <h2>{slug}</h2>
      <div className="container mx-auto mt-12 flex gap-3 max-lg:flex-col">
        {/* Post List */}
        <div className="flex flex-grow flex-col gap-3">
          <CreatePost />
          <Posts posts={communityDetails.posts} session={session} />
        </div>
        {/* Community Details */}
        {/* @ts-expect-error Server Side Async component */}
        <CommunityDetails
          community={{ ...communityDetails }}
          session={session}
        />
      </div>
    </>
  );
};

export default CommunityViewPage;
