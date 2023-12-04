"use client";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { Button } from "../custom/Button";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Community } from "@prisma/client";
import { useRouter } from "next/navigation";

interface UserCommunityActionsProps {
  creatorId: string;
  communityId: string;
}

const UserCommunityActions: FC<UserCommunityActionsProps> = ({
  creatorId,
  communityId,
}) => {
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const { mutate: deleteCommunity, isLoading: isLoadingDelCom } =
    useMutation<Community>({
      mutationFn: async () => {
        if (!session?.user) {
          router.push("/sign-in");

          throw new Error("User unauthorized");
        }
        const { data } = await axios.delete<Community>(`/api/c/${communityId}`);
        return data;
      },
      onError(error) {
        //handle errors
        console.log(error);
      },
      onSuccess(data) {
        // give a success toast
        router.push("/");
      },
    });

  const { mutate: toggleSubscription, isLoading: isLoadingUserSub } =
    useMutation({
      mutationFn: async () => {
        if (!session?.user) {
          router.push("/sign-in");
          throw new Error("User unauthorized");
        }
        const res = await axios.patch(`/api/c/${communityId}/subscription`);
        return res;
      },
      onError(error) {
        // handle errors here
        console.log(error);
      },
      onSuccess(data) {
        const { status } = data;
        if (status === 201) {
          setIsUserSubscribed(true);
        } else if (status === 204) {
          setIsUserSubscribed(false);
        }
      },
    });

  // get user subscription status
  useEffect(() => {
    const getUserSubscriptionStatus = async () => {
      try {
        const { data: subscriptionExits } = await axios.get<boolean>(
          `/api/c/${communityId}/subscription`,
        );
        if (subscriptionExits) {
          setIsUserSubscribed(true);
        } else {
          setIsUserSubscribed(false);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (session?.user) getUserSubscriptionStatus();
  }, [session?.user]);

  return (
    <>
      {session?.user.id === creatorId ? (
        <Button
          isLoading={isLoadingDelCom}
          onClick={() => deleteCommunity()}
          variant={"destructive"}
        >
          Delete Community
        </Button>
      ) : (
        <Button
          isLoading={isLoadingUserSub}
          variant={isUserSubscribed ? "destructive" : "outline"}
          onClick={() => toggleSubscription()}
        >
          {isUserSubscribed ? "Leave" : "Subscribe"}
        </Button>
      )}
    </>
  );
};

export default UserCommunityActions;
