"use client";
import { Post } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import PostView from "../client-side/PostView";
import { Button } from "../custom/Button";

interface PostListProps {
  posts: Post[];
  session: Session | null;

  slug: string;
  communityId?: string;
}

const PostList: FC<PostListProps> = ({ posts, slug, communityId }) => {
  const { data, hasNextPage, fetchNextPage, error, status, isFetching } =
    useInfiniteQuery({
      queryKey: ["posts", { communityId }],
      queryFn: async ({ pageParam = 1 }) => {
        const reqUrl = communityId
          ? `/api/post?c=${communityId}&page=${pageParam}`
          : `/api/post?page=${pageParam}`;
        const res = await axios.get(reqUrl);
        return res.data;
      },
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    });

  // reference to observer instance
  const observerRef = useRef<{
    intersectionObserver: IntersectionObserver;
  }>();

  const lastPostCallback = useCallback((lastPost: HTMLDivElement | null) => {
    if (!lastPost) {
      // console.log("element unmount");
      return;
    }

    if (!observerRef.current) {
      observerRef.current = {
        intersectionObserver: new IntersectionObserver(
          (enteries) => {
            const [entry] = enteries;
            if (entry.isIntersecting) fetchNextPage();
          },
          { threshold: 1 },
        ),
      };
    }

    console.log("unobserve works");
    observerRef.current.intersectionObserver.disconnect();

    console.log("ref applied");
    observerRef.current.intersectionObserver.observe(lastPost);
  }, []);

  useEffect(() => {
    if (!hasNextPage && !isFetching) {
      console.log("observer disconnected");
      observerRef.current?.intersectionObserver.disconnect();
    }
  }, [hasNextPage]);

  const content = data?.pages.flat().map((post: Post, i) => {
    if (data.pages.flat().length - 1 === i) {
      return (
        <PostView
          post={post}
          innerRef={lastPostCallback}
          communityNameSlug={slug}
          key={post.id}
        />
      );
    }
    return <PostView post={post} communityNameSlug={slug} key={post.id} />;
  });

  return (
    <div>
      <div className="flex flex-col gap-5">
        {content}
        {isFetching && <Loader2 className="mx-auto animate-spin" />}
      </div>
    </div>
  );
};

export default PostList;
