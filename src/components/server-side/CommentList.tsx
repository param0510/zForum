"use client";
import { Loader2 } from "lucide-react";
import CommentView from "../client-side/CommentView";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { CommentData } from "@/types/comment";
import { Button } from "../custom/Button";

interface CommentListProps {
  postId: string;
  replyToId?: string; // this helps us loop over the list of comments in order to get the replies
}

const CommentList = ({ postId, replyToId }: CommentListProps) => {
  const { isFetching, data, error, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery({
      queryKey: ["comments", { postId, replyToId }],
      staleTime: 60 * 1000,
      queryFn: async ({ pageParam = 1 }) => {
        const reqUrl = replyToId
          ? `/api/post/${postId}/comment?replyToId=${replyToId}&page=${pageParam}`
          : `/api/post/${postId}/comment?page=${pageParam}`;
        const res = await axios.get<CommentData[]>(reqUrl);
        return res.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    });

  // console.log("outside data", data);
  const content = data?.pages.flat().map((comment) => (
    <CommentView
      key={comment.id}
      comment={comment}
      // replies={comment.replies}
    />
  ));

  return (
    <div>
      {content}
      {isFetching && <Loader2 className="mx-auto mt-5 animate-spin" />}
      {hasNextPage && !isFetching && (
        <div className="flex w-full justify-center">
          <Button onClick={() => fetchNextPage()} className="mx-auto w-fit">
            Load more
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
