"use client";
import { useCustomToasts } from "@/hooks/use-custom-toasts";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { toast } from "@/hooks/use-toast";
import { formatTimeToNow } from "@/lib/utils";
import { CreateCommentPayload } from "@/lib/validators/comment";
import { Comment, CommentVote as CVote, User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "../custom/Button";
import UserAvatar from "../custom/UserAvatar";
import { Label } from "../shadcn-ui/Label";
import { Textarea } from "../shadcn-ui/Textarea";
import CommentVote from "./CommentVote";

interface CommentViewProps {
  comment: Comment & {
    author: User;
  };
  currentVote: CVote | undefined;
  votesAmt: number;
  postId: string;
}

const CommentView = ({
  comment,
  currentVote,
  votesAmt,
  postId,
}: CommentViewProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [input, setInput] = useState(`@${comment.author.username} `);
  const commentRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(commentRef, () => {
    setIsReplying(false);
  });
  const { loginToast } = useCustomToasts();

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async (payload: CreateCommentPayload) => {
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
            title: "Invalid reply",
            description: "Reply text is required",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Reply wasn't created successfully. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess() {
      setInput("");
      setIsReplying(false);
      router.refresh();
    },
  });

  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>

          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="mt-2 text-sm text-zinc-900">{comment.text}</p>

      <div className="flex items-center gap-2">
        <CommentVote
          commentId={comment.id}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />

        <Button
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
          variant="ghost"
          size="xs"
        >
          <MessageSquare className="mr-1.5 h-4 w-4" />
          Reply
        </Button>
      </div>

      {isReplying && (
        <div className="grid w-full gap-1.5">
          <Label htmlFor="comment">Your comment</Label>
          <div className="mt-2">
            <Textarea
              onFocus={(e) =>
                e.currentTarget.setSelectionRange(
                  e.currentTarget.value.length,
                  e.currentTarget.value.length,
                )
              }
              autoFocus
              id="comment"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              // onKeyUp={(e) =>
              //   e.key === "Enter" && input.trim().length
              //     ? postComment({
              //         text: input.trim(),
              //         replyToId: comment.replyToId ?? comment.id, // default to top-level comment
              //       })
              //     : null
              // }
              rows={1}
              placeholder="What are your thoughts?"
            />

            <div className="mt-2 flex justify-end gap-2">
              <Button
                tabIndex={-1}
                variant="subtle"
                onClick={() => setIsReplying(false)}
              >
                Cancel
              </Button>
              <Button
                isLoading={isLoading}
                onClick={() => {
                  if (!input.trim()) return;
                  postComment({
                    text: input.trim(),
                    replyToId: comment.replyToId ?? comment.id, // default to top-level comment
                  });
                }}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentView;
