"use client";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import {
  CreatePostPayloadSchema,
  PostTitleValidation,
  PostTitleValidationSchema,
} from "@/lib/validators/post";
import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { ZodError } from "zod";
import { Button } from "../custom/Button";
import Editor from "../custom/Editor";

interface CreatePostProps {
  communityId: string;
  communityName: string;
}

export const CreatePost: FC<CreatePostProps> = ({
  communityId,
  communityName,
}) => {
  const editorRef = useRef<{ editor: EditorJS }>();
  const router = useRouter();
  const { loginToast } = useCustomToasts();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PostTitleValidation>({
    resolver: zodResolver(PostTitleValidationSchema),
    defaultValues: {
      title: "",
    },
  });

  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref: titleRef, ...rest } = register("title");

  // Get editor data
  const getEditorData = () => {
    return editorRef.current?.editor
      ?.save()
      .then((data) => data)
      .catch((e) => e);
  };

  // Use mutation definition
  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: async ({ title }: PostTitleValidation) => {
      const data = {
        title,
        content: await getEditorData(),
        communityId,
      };
      const payload = CreatePostPayloadSchema.parse(data);
      const response = await axios.post<Post>("/api/post", payload);
      return response;
    },
    onError(error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          return toast({
            title: "Error: User Authorization",
            description: "You must be subscribed to a community to make a post",
            variant: "destructive",
          });
        }

        if (error.response?.status === 401) {
          return loginToast();
        }
      } else if (error instanceof ZodError) {
        return toast({
          title: "Error: Invalid data format",
          description: "Title and Content both are required",
          variant: "destructive",
        });
      }
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess() {
      // console.log("Post Created Successfully", data);
      router.push(`/c/view/${communityName}`);
      router.refresh();
      return toast({
        description: "Your post has been published.",
      });
    },
  });

  // Display error messages in toast format for all the - useForm hook errors
  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong.",
          description: value.message ?? "Please try again later",
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  return (
    <>
      <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4">
        <form
          id="subreddit-post-form"
          className="w-fit"
          onSubmit={handleSubmit((e) => createPost(e))}
        >
          <div className="prose prose-stone dark:prose-invert">
            <TextareaAutosize
              ref={(e) => {
                titleRef(e);
                _titleRef.current = e;
              }}
              // {...register("title")}
              // autoFocus={true}
              placeholder="Title"
              className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            />
            <Editor editorRef={editorRef} _titleRef={_titleRef} />
            <p className="text-sm text-gray-500">
              Use{" "}
              <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                Tab
              </kbd>{" "}
              to open the command menu.
            </p>
          </div>
        </form>
      </div>
      {/* Submit btn */}
      <div className="flex w-full justify-end">
        <Button
          type="submit"
          className="w-full"
          form="subreddit-post-form"
          isLoading={isLoading}
        >
          Post
        </Button>
      </div>
    </>
  );
};
