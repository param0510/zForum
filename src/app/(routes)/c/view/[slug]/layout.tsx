import UserCommunityActions from "@/components/server-side/UserCommunityActions";
import { buttonVariants } from "@/components/custom/Button";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import ToFeedButton from "@/components/client-side/ToFeedButton";

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
    redirect("/");
    return notFound(); // This works but the colors are not compatible with our light theme. (Text color is white - can't be seen)
  }
  const memberCount = await db.subscription.count({
    where: {
      communityId: communityDetails.id,
    },
  });

  return (
    <div className="mx-auto h-full max-w-7xl pt-12 sm:container">
      <div>
        <ToFeedButton />

        <div className="grid grid-cols-1 gap-y-4 py-6 md:grid-cols-3 md:gap-x-4">
          <ul className="col-span-2 flex flex-col space-y-6">{children}</ul>

          {/* info sidebar */}
          <div className="order-first h-fit overflow-hidden rounded-lg border border-gray-200 md:order-last">
            <div className="px-6 py-4">
              <p className="py-3 font-semibold">
                About c/{communityDetails.name}
              </p>
            </div>
            <dl className="divide-y divide-gray-100 bg-white px-6 py-4 text-sm leading-6">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={communityDetails.createdAt.toDateString()}>
                    {format(communityDetails.createdAt, "MMMM d, yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              {communityDetails.creatorId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <dt className="text-gray-500">You created this community</dt>
                </div>
              ) : null}
              {/*  @ts-expect-error server component */}
              <UserCommunityActions
                session={session}
                creatorId={communityDetails.creatorId}
                communityId={communityDetails.id}
                communityName={communityDetails.name}
              />
              <Link
                className={buttonVariants({
                  variant: "outline",
                  className: "mb-6 w-full",
                })}
                href={`c/view/${slug}/post/create`}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityViewLayout;
