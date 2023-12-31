import { db } from "@/lib/db";
import { Session } from "next-auth";
import DeleteCommunityAction from "../client-side/DeleteCommunityAction";
import SubscriptionToggleAction from "../client-side/SubscriptionToggleAction";

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
      {session?.user.id ===
      creatorId ? // DELETE COMMUNITY FUNCTION ONLY WORKS IF THERE ARE NO POST WITH COMMENTS HAVING REPLIES. PRISMA SCHEMA PROBLEM - WORK ON THIS LATER
      // <DeleteCommunityAction
      //   communityId={communityId}
      //   communityName={communityName}
      // />
      null : (
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
