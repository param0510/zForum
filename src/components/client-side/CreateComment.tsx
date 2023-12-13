"use client";
import { CreateCommentPayload } from "@/lib/validators/comment";
import { Comment } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Button } from "../custom/Button";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
  setReplyMode?: Dispatch<SetStateAction<boolean>>;
}

const CreateComment: FC<CreateCommentProps> = ({
  postId,
  replyToId,
  setReplyMode,
}) => {
  const [input, setInput] = useState<string>("");
  const { data: session } = useSession();
  const router = useRouter();
  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async () => {
      if (!input.trim().length) {
        // display a validation error
        throw new Error("Comment text is required");
      }
      if (!session?.user) {
        throw new Error("Unauthorized user");
      }
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
    onError(error) {
      console.log("Error:", error);
    },
    onSuccess(comment) {
      console.log("Created Comment", comment);
      setInput("");
      if (setReplyMode) {
        setReplyMode(false);
      }
      // const commentData: CommentData = {
      //   ...comment,
      //   author: {
      //     image: session?.user.image ?? "",
      //     username: session?.user.username ?? "",
      //   },
      // };
    },
    onSettled() {
      router.refresh();
    },
  });

  return (
    <div className="flex w-full items-center gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && postComment()}
        placeholder="Create a comment here"
        className="grow rounded-sm p-2"
      />
      {!setReplyMode ? (
        <Button isLoading={isLoading} onClick={() => postComment()}>
          Comment
        </Button>
      ) : (
        <>
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <>
              <X
                size={20}
                className="cursor-pointer"
                onClick={() => {
                  setInput("");
                  setReplyMode(false);
                }}
              />
              <Check
                size={20}
                className="cursor-pointer"
                onClick={() => postComment()}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CreateComment;
