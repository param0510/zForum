"use client";
import { FC, useRef } from "react";
import { Button } from "../custom/Button";
import Editor from "../custom/Editor";
import EditorJS from "@editorjs/editorjs";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CreatePostPayload,
  CreatePostPayloadSchema,
} from "@/lib/validators/post";
import { Post } from "@prisma/client";
import { ZodError } from "zod";

interface FormData {
  title: string;
}

interface CreatePostProps {
  communityId: string;
  communityName: string;
  communityCreatorId: string;
}

export const CreatePost: FC<CreatePostProps> = ({
  communityId,
  communityName,
  communityCreatorId,
}) => {
  const editorRef = useRef<{ editor: EditorJS }>();
  const router = useRouter();
  const { setQueryData } = useQueryClient();
  const { register, getValues: getFormValues } = useForm<FormData>();
  const { data: session } = useSession();

  // Get editor data
  const getEditorData = () => {
    return editorRef.current?.editor
      ?.save()
      .then((data) => data)
      .catch((e) => e);
  };

  // Use mutation definition
  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async () => {
      // console.log(getValues());
      // console.log(formState.errors);
      // take this under @/lib/loginStatus - (use a custom hook inside it to display message)
      if (!session) {
        console.log("Login is required!");
        router.push("/sign-in");
        throw new Error("Unauthorized user");
      }
      const data: CreatePostPayload = {
        title: getFormValues("title"),
        content: await getEditorData(),
        communityId,
        communityCreatorId,
      };
      const payload = CreatePostPayloadSchema.parse(data);
      const response = await axios.post<Post>("/api/post", payload);
      return response.data;
    },
    onError(error) {
      // Provide Errror responses here. Make it a standard library under @/lib/error
      if (error instanceof AxiosError) {
        const { status, message } = error;
        console.log("Server Error:", status, "-", message);
      } else if (error instanceof ZodError) {
        console.log("Invalid Data:", error);
      } else {
        console.log(error);
      }
    },
    onSuccess(data) {
      console.log("Post Created Successfully", data);
      router.push(`/c/view/${communityName}`);
      // Cache the newly created post
      // setQueryData('posts', [])
    },
  });

  function sumbitTest(params: any) {}
  return (
    <>
      <form>
        <textarea
          className="w-full bg-zinc-700 text-3xl"
          rows={1}
          placeholder="Post Title"
          {...register("title", {
            // Validation Not working, CHECK THIS ONE #REFRACTOR
            minLength: {
              value: 2,
              message: "Minimum length of post title - 2 chars",
            },
            max: 21,
            required: "Title is required",
            // same as required
            validate: {
              tooShort: (fieldValue) => {
                return fieldValue.trim().length > 0 || "Title is required";
              },
            },
          })}
        />
        <Editor editorRef={editorRef} session={session} router={router} />
      </form>
      <Button isLoading={isLoading} onClick={() => createPost()}>
        Post
      </Button>
    </>
  );
};
