"use client";
import { FC } from "react";
import { Button } from "../custom/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface DeleteCommunityActionProps {
  communityId: string;
  communityName: string;
}

const DeleteCommunityAction: FC<DeleteCommunityActionProps> = ({
  communityId,
  communityName,
}) => {
  const { loginToast } = useCustomToasts();
  const router = useRouter();

  const { mutate: deleteCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`/api/c/${communityId}`);
      return data;
    },
    onError(err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
        if (err.response?.status === 403) {
          return toast({
            title: "Error deleting community.",
            description: "Only a creator can delete a community",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess() {
      toast({
        title: "Deleted!",
        description: `You have now successfully deleted c/${communityName}`,
      });
      // give a success toast
      router.push("/");
    },
  });
  return (
    <Button
      className="mb-4 mt-1 w-full"
      variant={"destructive"}
      onClick={() => deleteCommunity()}
      isLoading={isLoading}
    >
      Delete Community
    </Button>
  );
};

export default DeleteCommunityAction;
