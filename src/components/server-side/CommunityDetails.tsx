import { FC } from "react";
import { Button } from "../custom/Button";
import { Community } from "@prisma/client";
import { Session } from "next-auth";
import { db } from "@/lib/db";
import UserCommunityActions from "../client-side/UserCommunityActions";

interface CommunityDetailsProps {
  community: Community;
  session: Session | null;
}

const CommunityDetails = async ({
  community: { name, createdAt, creatorId, id },
  session,
}: CommunityDetailsProps) => {
  const membersCount = await db.subscription.count({
    where: {
      communityId: id,
    },
  });
  return (
    <section className="mt-12 flex h-fit flex-col gap-4 rounded-lg bg-slate-400/30 p-4">
      <h4 className="font-semibold">About c/{name}</h4>
      <p>Created - {createdAt.toString()}</p>
      {/* +1 for the creator - (creator is not a subscriber) */}
      <p>Members - {membersCount + 1}</p>
      {/* Client component for user subscribe/join/delete_community buttons */}
      {session?.user && (
        <UserCommunityActions creatorId={creatorId} communityId={id} />
      )}
    </section>
  );
};

export default CommunityDetails;
