"use client";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { Button } from "../custom/Button";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  UpdateUserPayload,
  UpdateUserPayloadSchema,
} from "@/lib/validators/user";
import axios from "axios";
import { User } from "@prisma/client";

interface SettingsFormProps {}

const SettingsForm: FC<SettingsFormProps> = ({}) => {
  const { data: session, update } = useSession();
  const [username, setUsername] = useState("");

  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: async () => {
      if (!session) {
        throw new Error("User unauthorized");
      }
      const payload = { id: session.user.id, username };
      const { data } = await axios.patch<User>("/api/user", payload);
      return data;
    },
    onError(error) {
      console.log(error);
    },
    onSuccess: async (data) => {
      if (session) {
        session.user.username = data.username!;
        await update(session);
      }
    },
  });
  useEffect(() => {
    if (session) setUsername(session.user.username);
  }, [session?.user.id]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex max-w-md items-center gap-7 px-4 py-8 text-lg">
        <label htmlFor="username">Username:</label>
        <textarea
          name="username"
          rows={1}
          className="grow resize-none rounded-md px-3 py-1 text-base"
          onChange={(e) => setUsername(e.target.value)}
          //   defaultValue={session?.user.username}
          value={username}
        />
      </div>
      <Button
        isLoading={isLoading}
        className="w-max"
        onClick={() => updateUser()}
      >
        Save Changes
      </Button>
    </div>
  );
};

export default SettingsForm;
