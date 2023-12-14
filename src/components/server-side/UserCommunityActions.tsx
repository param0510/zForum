import { db } from "@/lib/db";
import { Session } from "next-auth";
import SubscriptionToggleAction from "../client-side/SubscriptionToggleAction";
import { Button } from "../custom/Button";
import DeleteCommunityAction from "../client-side/DeleteCommunityAction";

interface UserCommunityActionsProps {
  creatorId: string;
  communityId: string;
  session: Session | null;
  communityName: string;
}

const UserCommunityActions = async ({
  creatorId,
  communityId,
  session,
  communityName,
}: UserCommunityActionsProps) => {
  const subscriptionStatus = session?.user
    ? await db.subscription.findUnique({
        where: {
          userId_communityId: {
            userId: session.user.id,
            communityId,
          },
        },
      })
    : undefined;
  const isUserSubscribed = !!subscriptionStatus;

  return (
    <>
      {session?.user.id === creatorId ? (
        <DeleteCommunityAction
          communityId={communityId}
          communityName={communityName}
        />
      ) : (
        <SubscriptionToggleAction
          isSubscribed={isUserSubscribed}
          communityId={communityId}
          communityName={communityName}
        />
      )}
    </>
  );
};

export default UserCommunityActions;
