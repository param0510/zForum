import CommunityDetails from "@/components/server-side/CommunityDetails";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FC } from "react";

interface CommunityViewLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

const CommunityViewLayout = async ({
  children,
  params: { slug },
}: CommunityViewLayoutProps) => {
  const session = await getServerAuthSession();
  const communityDetails = await db.community.findUnique({
    where: {
      name: slug,
    },
  });
  // If the community doesn't exist redirect to 404 page
  if (!communityDetails) {
    return notFound();
  }
  return (
    <>
      <div className="container mx-auto mt-12 flex gap-3 max-lg:flex-col">
        <div className="flex flex-grow flex-col gap-3">{children}</div>
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

export default CommunityViewLayout;
