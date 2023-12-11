"use client";
import { Post } from "@prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { FC, useCallback, useEffect, useRef } from "react";
import PostView from "../client-side/PostView";

interface PostListProps {
  posts: Post[];
  session: Session | null;

  slug: string;
  communityId?: string;
}

const PostList: FC<PostListProps> = ({ posts, slug, communityId }) => {
  // useInfiniteQuery provided by tanstack-query
  //
  const { data, hasNextPage, fetchNextPage, error, status, isFetching } =
    useInfiniteQuery({
      queryKey: ["posts", { communityId }],
      // we need to provide a default value to 'pageParam' property for inital one-time fetching.
      queryFn: async ({ pageParam = 1 }) => {
        // dynamic url for Feed/Community_Posts - This helps us use this component in general Feed and also in Component Specific Posts list
        const reqUrl = communityId
          ? `/api/post?c=${communityId}&page=${pageParam}`
          : `/api/post?page=${pageParam}`;
        const res = await axios.get(reqUrl);
        return res.data;
      },
      // this helps us know if there is any more pages of data available to be fetched from the api.
      // When it returns undefined fetching - hasNextPage hooks turns - 'false' else it is 'true'
      getNextPageParam: (lastPage, allPages) => {
        // 'allPages' consists of an array of pages where 'lastPage' is the last item on 'allPages' array
        // So we return the 'pageParam' property value here according to the previously attained response from the api, (stored in 'lastPage')
        return lastPage.length ? allPages.length + 1 : undefined;
      },
    });

  // reference to observer instance.
  // using useRef helps us retain the same instance of IntersectionObserver across different re-renders
  const observerRef = useRef<{
    intersectionObserver: IntersectionObserver;
  }>();

  // Callback defined for element ref (mount/unmount) event handling
  const lastPostCallback = useCallback((lastPost: HTMLDivElement | null) => {
    // If the element unmounts, the function receives null - We do nothing
    if (!lastPost) {
      return;
    }

    // If observerRef.current is not defined yet. We create a new instance of IntersectionObserver() and store it inside to listen for specified element intersection events (entry/leave the root window)
    if (!observerRef.current) {
      observerRef.current = {
        intersectionObserver: new IntersectionObserver(
          (enteries) => {
            const [entry] = enteries;
            if (entry.isIntersecting) fetchNextPage();
          },
          // Threshold makes it necessary for the whole element to enter the window fully -> (1)
          { threshold: 1 },
        ),
      };
    }

    // We remove any previous elements being observed by the observer to start fresh - (Redundant for the initial setup but is very important for successful re-renders)
    // console.log("unobserve works");
    observerRef.current.intersectionObserver.disconnect();

    // making the observer track the newly added last element in the post list. (After clearing the previously being tracked elements, above)
    // console.log("ref applied");
    observerRef.current.intersectionObserver.observe(lastPost);
  }, []);

  // This useEffect enables us to stop intersectionObserver event from firing the fetchNextPage() to get more data
  useEffect(() => {
    if (!hasNextPage && !isFetching) {
      // console.log("observer disconnected");
      observerRef.current?.intersectionObserver.disconnect();
    }
  }, [hasNextPage]);

  // Posts list being laid out in the UI
  // .flat() is very important as it flatens the array of pages: (Post[])[] -> Post[]
  // console log to understand the structure better
  const content = data?.pages.flat().map((post: Post, i) => {
    // Checking if the post is the last one in the array
    if (data.pages.flat().length - 1 === i) {
      return (
        <PostView
          post={post}
          innerRef={lastPostCallback} // we only set the lastPostCallback for the last post in the flattened pages array
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
