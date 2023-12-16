"use client";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { toast } from "@/hooks/use-toast";
import { CreateCommentPayload } from "@/lib/validators/comment";
import { Comment } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../custom/Button";
import { Label } from "../shadcn-ui/Label";
import { Textarea } from "../shadcn-ui/Textarea";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>("");
  const { loginToast } = useCustomToasts();
  const router = useRouter();
  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateCommentPayload = {
        text: input.trim(),
        replyToId,
      };
      const { data } = await axios.post<Comment>(
        `/api/post/${postId}/comment`,
        payload,
      );
      return data;
    },
    onError(err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
        if (err.response?.status === 400) {
          return toast({
            title: "Invalid comment",
            description: "Comment text is required",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Comment wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess() {
      setInput("");
      router.refresh();
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          // onKeyUp={(e) =>
          //   e.key === "Enter" && input.trim().length ? postComment() : null
          // }
          rows={1}
          placeholder="What are your thoughts?"
        />

        <div className="mt-2 flex justify-end">
          <Button
            isLoading={isLoading}
            disabled={input.trim().length === 0}
            onClick={() => postComment()}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateComment;
