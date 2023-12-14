"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/Card";
import { Input } from "@/components/shadcn-ui/Input";
import { Label } from "@/components/shadcn-ui/Label";
import { toast } from "@/hooks/use-toast";
import { UpdateUserPayloadSchema } from "@/lib/validators/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../custom/Button";

interface SettingsFormProps {
  user: Pick<User, "id" | "username">;
}
type UserFormData = z.infer<typeof UpdateUserPayloadSchema>;

const SettingsForm: FC<SettingsFormProps> = ({ user }) => {
  const { data: session, update } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(UpdateUserPayloadSchema),
    defaultValues: {
      username: user?.username || "",
    },
  });

  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: async ({ username }: UserFormData) => {
      const payload = { username };
      const { data } = await axios.patch<User>("/api/user", payload);
      return data;
    },
    onError(err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username already taken.",
            description: "Please choose another username.",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your username was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: async (data) => {
      // update the username in the active session
      await update({ ...session, user: { username: data.username } });
      toast({
        title: "Profile saved",
        description: "Your username has been updated.",
      });
      router.refresh();
    },
  });

  return (
    <form onSubmit={handleSubmit((e) => updateUser(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you are comfortable with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute left-0 top-0 grid h-10 w-8 place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register("username")}
            />
            {errors?.username && (
              <p className="px-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-1">
          <Button
            type="button"
            variant={"destructive"}
            disabled={isLoading}
            onClick={() => router.push("/")}
          >
            Cancel
          </Button>
          <Button isLoading={isLoading}>Change username</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SettingsForm;
