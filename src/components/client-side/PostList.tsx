"use client";
import { ExtendedPost } from "@/types/post";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FC, useCallback, useEffect, useRef } from "react";
import PostView from "./PostView";

interface PostListProps {
  // slug: string;
  initialPosts: ExtendedPost[];
  communityId?: string;
}

const PostList: FC<PostListProps> = ({ communityId, initialPosts }) => {
  // useInfiniteQuery provided by tanstack-query
  const { data, hasNextPage, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["posts", { communityId }],
    // we need to provide a default value to 'pageParam' property for inital one-time fetching.
    queryFn: async ({ pageParam = 1 }) => {
      // dynamic url for Feed/Community_Posts - This helps us use this component in general Feed and also in Component Specific Posts list

      const reqUrl =
        `/api/post?page=${pageParam}` +
        (!!communityId ? `&c=${communityId}` : "");

      const res = await axios.get<ExtendedPost[]>(reqUrl);
      return res.data;
    },
    // this helps us know if there is any more pages of data available to be fetched from the api.
    // When it returns undefined fetching - hasNextPage hooks turns - 'false' else it is 'true'
    getNextPageParam: (lastPage, allPages) => {
      // 'allPages' consists of an array of pages where 'lastPage' is the last item on 'allPages' array
      // So we return the 'pageParam' property value here according to the previously attained response from the api, (stored in 'lastPage')
      return lastPage.length ? allPages.length + 1 : undefined;
    },
    initialData: {
      pages: [initialPosts],
      pageParams: [1],
    },
  });

  // reference to observer instance.
  // using useRef helps us retain the same instance of IntersectionObserver across different re-renders
  const observerRef = useRef<{
    intersectionObserver: IntersectionObserver;
  }>();

  // Callback defined for element ref (mount/unmount) event handling
  const lastPostCallback = useCallback((lastPost: HTMLLIElement | null) => {
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
            if (entry.isIntersecting) {
              fetchNextPage();
            }
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

  // CHECK FOR ITS NEED AND REMOVE IT IF NOT NEEDED
  // Posts list being laid out in the UI
  // .flat() is very important as it flatens the array of pages: (Post[])[] -> Post[]
  // console log to understand the structure better
  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  const content = posts.map((post: ExtendedPost, i) => {
    // Checking if the post is the last one in the array
    if (posts.length - 1 === i) {
      return (
        <li key={post.id} ref={lastPostCallback}>
          <PostView
            post={post}
            commentAmt={post.comments.length}
            // we only set the lastPostCallback for the last post in the flattened pages array
            communityNameSlug={post.community.name}
          />
        </li>
      );
    }
    return (
      <li key={post.id}>
        <PostView
          post={post}
          commentAmt={post.comments.length}
          communityNameSlug={post.community.name}
        />
      </li>
    );
  });

  // Posts list being laid out in the UI
  // .flat() is very important as it flatens the array of pages: (Post[])[] -> Post[]
  // console log to understand the structure better

  // const content = data?.pages.flat().map((post: ExtendedPost, i) => {
  //   // Checking if the post is the last one in the array
  //   if (data.pages.flat().length - 1 === i) {
  //     return (
  //       <PostView
  //         post={post}
  //         // we only set the lastPostCallback for the last post in the flattened pages array
  //         innerRef={lastPostCallback}
  //         communityNameSlug={post.community.name}
  //         key={post.id}
  //       />
  //     );
  //   }
  //   return (
  //     <PostView
  //       post={post}
  //       communityNameSlug={post.community.name}
  //       key={post.id}
  //     />
  //   );
  // });

  return (
    <ul className="'flex space-y-6' col-span-2 flex-col">
      {content}
      {isFetching && (
        <li className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </li>
      )}
    </ul>
  );
};

export default PostList;
