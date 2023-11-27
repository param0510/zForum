import { FC } from "react";
import { Button } from "../custom/Button";
import { Community } from "@prisma/client";
import { Session } from "next-auth";
import { db } from "@/lib/db";

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
    <section className="flex flex-col gap-4">
      <h4 className="font-semibold">About c/{name}</h4>
      <p>Created - {createdAt.toString()}</p>
      {/* +1 for the creator - (creator is not a subscriber) */}
      <p>Members - {membersCount + 1}</p>

      {session?.user.id === creatorId ? (
        <Button variant={"destructive"}>Delete Community</Button>
      ) : (
        <Button variant={"outline"}>Subscribe</Button>
      )}
    </section>
  );
};

export default CommunityDetails;
