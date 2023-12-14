"use client";
import { Button } from "@/components/custom/Button";
// import { SubscribeToSubredditPayload } from "@/lib/validators/community";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { cn } from "@/lib/utils";

interface SubscriptionToggleProps {
  isSubscribed: boolean;
  communityId: string;
  communityName: string;
}

const SubscriptionToggleAction = ({
  isSubscribed,
  communityId,
  communityName,
}: SubscriptionToggleProps) => {
  const { toast } = useToast();
  const { loginToast } = useCustomToasts();
  const router = useRouter();
  const [isUserSubscribed, setIsUserSubscribed] = useState(isSubscribed);

  useEffect(() => {
    setIsUserSubscribed(isSubscribed);
  }, [isSubscribed]);

  const { mutate: toggleSubscription, isLoading } = useMutation({
    mutationFn: async () => {
      const res = await axios.patch(`/api/c/${communityId}/subscription`);
      return res;
    },
    onError(err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess(data) {
      const { status } = data;
      if (status === 201) {
        setIsUserSubscribed(true);
        toast({
          title: "Subscribed!",
          description: `You are now subscribed to c/${communityName}`,
        });
      } else if (status === 204) {
        setIsUserSubscribed(false);
        toast({
          title: "Unsubscribed!",
          description: `You are now unsubscribed from c/${communityName}`,
        });
      }
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh();
      });
    },
  });

  return (
    <Button
      className="mb-4 mt-1 w-full"
      variant={isUserSubscribed ? "destructive" : "default"}
      isLoading={isLoading}
      onClick={() => toggleSubscription()}
    >
      {isUserSubscribed ? "Leave community" : "Subscribe to post"}
    </Button>
  );
};

export default SubscriptionToggleAction;
