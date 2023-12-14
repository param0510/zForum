"use client";
import { CreateCommunityPayloadSchema } from "@/lib/validators/community";
import { Community } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useCallback, useEffect, useState } from "react";
import { ZodError } from "zod";
import { Button } from "../custom/Button";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { Input } from "../shadcn-ui/Input";
import debounce from "lodash.debounce";
import { toast } from "@/hooks/use-toast";

interface CreateCommunityClientProps {
  existingCommunityNames: string[];
}

const CreateCommunityClient: FC<CreateCommunityClientProps> = ({
  existingCommunityNames,
}) => {
  const router = useRouter();
  const [input, setInput] = useState<string>("");
  const [nameExists, setNameExists] = useState<boolean>(false);
  const { loginToast } = useCustomToasts();

  const communityNameValidator = (inputValue: string): void => {
    const validity: boolean = inputValue.trim().length
      ? !!existingCommunityNames.includes(inputValue)
      : false;
    setNameExists(validity);
  };
  const debounceFn = useCallback(debounce(communityNameValidator, 200), []);

  // Mutation Query to create a new Community
  const { mutate: addCommunity, isLoading } = useMutation<string>({
    mutationFn: async () => {
      // Enforce validity using zod here
      const payload = CreateCommunityPayloadSchema.parse({ name: input });
      const { data } = await axios.post<string>("/api/c", payload);
      return data;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subreddit already exists.",
            description: "Please choose a different name.",
            variant: "destructive",
          });
        }

        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      if (err instanceof ZodError) {
        return toast({
          title: "Invalid subreddit name.",
          description: "Please choose a name between 3 and 26 letters.",
          variant: "destructive",
        });
      }

      toast({
        title: "There was an error.",
        description: "Could not create subreddit.",
        variant: "destructive",
      });
    },
    onSuccess(data: string) {
      // redirect to the newly created page or give a toast
      router.push(`/c/view/${data}`);
      router.refresh();
    },
  });

  return (
    <div className="container mx-auto flex h-full max-w-3xl items-center">
      <div className="relative h-fit w-full space-y-6 rounded-lg bg-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>
        <hr className="h-px bg-red-500" />

        <div className="flex flex-col gap-1">
          <p className="text-lg font-medium">Name</p>
          <p className="pb-2 text-xs">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative">
            <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm text-zinc-400">
              r/
            </p>
            <Input
              autoFocus={true}
              className="pl-6"
              value={input}
              onChange={(e) => {
                const value = e.target.value;
                setInput(value);
                debounceFn(value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter" && input.trim() && !nameExists) {
                  addCommunity();
                }
              }}
            />
          </div>
          {nameExists && (
            <p className="pt-1 align-sub text-xs font-semibold text-red-600">
              Community name already exists
            </p>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            disabled={isLoading}
            variant="subtle"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.trim().length === 0 || nameExists}
            onClick={() => addCommunity()}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCommunityClient;
