"use client";
import { CreateCommunityPayloadSchema } from "@/lib/validators/community";
import { Community } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { ZodError } from "zod";
import { Button } from "../custom/Button";

interface CreateCommunityClientProps {}

const CreateCommunityClient: FC<CreateCommunityClientProps> = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [input, setInput] = useState<string>("");
  const [isInputInvalid, setIsInputInvalid] = useState<boolean>(false);
  // use this to update the cached created communityNames in fetch useQuery
  const queryClient = useQueryClient();

  // useQuery Hook definition for fetching already existing names of
  const { data: existingCommunityNames } = useQuery<string[], Error>({
    queryKey: ["communityNames"],
    staleTime: 1000 * 60 * 5, // 5 mins for being fresh
    queryFn: async () => {
      // console.log("fetch runs");
      const { data } = await axios.get<Community[]>("/api/c");
      return data.map((c) => c.name);
    },
  });

  // #Task: move to lib/validators
  // Community Name Validator to check if the name already exs
  const communityNameValidator = (): void => {
    const validity: boolean = input.trim().length
      ? !!existingCommunityNames?.includes(input)
      : false;
    setIsInputInvalid(validity);
  };

  // Mutation Query to create a new Community
  const { mutate: addCommunity, isLoading } = useMutation<string>({
    mutationFn: async () => {
      if (!session?.user) {
        router.push("/sign-in");
        // trigger sign-in toast here
        throw new Error("Unauthorized User");
      }
      // Enforce validity using zod here
      const payload = CreateCommunityPayloadSchema.parse({ name: input });
      const { data } = await axios.post<string>("/api/c", payload);
      return data;
    },

    //#Task: create Toasts for the specific use cases that can be applied.
    onError: (error: any) => {
      if (error instanceof AxiosError) {
        const { message, response } = error;
        const status = response?.status;
        // handle the errors with different status codes
        if (status === 401) {
          console.log("Unauthorized access:", status, "-", message);
        } else if (status === 409) {
          console.log("Data Conflict:", status, "-", message);
        } else if (status === 422) {
          console.log("Client Error (invalid payload):", status, "-", message);
        } else if (status === 500) {
          console.log("Server timed out error:", status, "-", message);
        }
      } else if (error instanceof ZodError) {
        const { issues } = error;
        console.log("Client Error (invalid community name):", issues);
      } else {
        console.log(error);
      }
    },
    onSuccess(data: string) {
      console.log("Successfully created community", data);
      // caching the react-query results for 'communityNames' useQuery above
      if (existingCommunityNames) {
        const upatedCommunityNames: string[] = [
          ...existingCommunityNames,
          data,
        ];
        queryClient.setQueryData<string[]>(
          ["communityNames"],
          upatedCommunityNames,
        );
      } else {
        // make the "communityNames" - useQuery invalid/stale. so that it refetches the data with the newly added community
        // this is done to prevent incorrect manual caching of "communityNames" incase if the database takes time to send the community names and the user already creates a new community.
        queryClient.invalidateQueries<string[]>(["communityNames"]);
      }
      setInput("");
      // redirect to the newly created page or give a toast
      router.push(`/c/view/${data}`);
    },
  });

  // Implement lazy function call over here later. Function which gets called in search bar
  useEffect(() => {
    communityNameValidator();
    // console.log(existingCommunityNames);
  }, [input]);

  return (
    <>
      <input
        autoFocus={true}
        type="text"
        className="p-2 text-black"
        placeholder="c/"
        value={input}
        onKeyUp={(e) => {
          if (e.key === "Enter" && input.trim()) {
            addCommunity();
            // console.log("this works:", input);
          }
        }}
        onChange={(e) => setInput(e.target.value)}
      />
      {isInputInvalid && (
        <p className="align-sub text-sm text-red-300">
          Community name already exists
        </p>
      )}
      <div className="flex gap-2">
        <Button variant={"subtle"} onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          disabled={!!!input.trim() || isInputInvalid}
          onClick={() => addCommunity()}
          isLoading={isLoading}
        >
          Create
        </Button>
      </div>
    </>
  );
};

export default CreateCommunityClient;
