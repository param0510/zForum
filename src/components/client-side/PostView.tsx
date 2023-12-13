import { Post, PostVote as PV } from "@prisma/client";
import Link from "next/link";
import EditorOutput from "../custom/EditorOutput";
import PostVote from "./PostVote";
import { Ref, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { formatTimeToNow } from "@/lib/utils";
import { ExtendedPost } from "@/types/post";

interface PostViewProps {
  post: Post & {
    author: {
      username: string | null;
    };
  };
  communityNameSlug: string;
  commentAmt: number;
  // innerRef?: Ref<HTMLDivElement>;
}

const PostView = ({ post, communityNameSlug, commentAmt }: PostViewProps) => {
  // #UPDATE: this will not work - client component
  const pRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex justify-between px-6 py-4">
        <PostVote postId={post.id} />

        <div className="w-0 flex-1">
          <div className="mt-1 max-h-40 text-xs text-gray-500">
            <a
              className="text-sm text-zinc-900 underline underline-offset-2"
              href={`/c/view/${communityNameSlug}`}
            >
              c/{communityNameSlug}
            </a>
            <span className="px-1">•</span>
            <span>Posted by u/{post.author.username}</span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/c/view/${communityNameSlug}/post/view?info=${post.id}`}>
            <h1 className="py-2 text-lg font-semibold leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className="relative max-h-40 w-full overflow-clip text-sm"
            ref={pRef}
          >
            <EditorOutput data={post.content} />
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="z-20 bg-gray-50 px-4 py-4 text-sm sm:px-6">
        <Link
          href={`/c/view/${communityNameSlug}/post/view?info=${post.id}`}
          className="flex w-fit items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt ?? 0} comments
        </Link>
      </div>
    </div>
  );

  // return (
  //   // Side buttons for voting
  //   <>
  //     <div className="flex items-center gap-0.5">
  //       <div className="flex grow-0 flex-col items-center justify-center gap-1.5">
  //         <PostVote postId={post.id} />
  //       </div>
  //       <Link
  //         href={`c/view/${communityNameSlug}/post/view?info=${post.id}`}
  //         className="flex grow flex-col gap-0"
  //       >
  //         {/* Post body */}
  //         <div className="flex max-h-[270px] flex-col gap-3 overflow-hidden rounded-md bg-white/10 p-6">
  //           <div className="flex justify-between gap-2">
  //             <div className="flex flex-col gap-1">
  //               <span>c/{communityNameSlug}</span>
  //               <h2 className="text-2xl font-semibold">{post.title}</h2>
  //             </div>
  //             <p className="flex gap-2">
  //               <span>u/{post.authorId}</span>
  //               <span>@</span>
  //               {/* ts-ignore */}
  //               <span>{new Date(post.createdAt).toISOString()}</span>
  //             </p>
  //           </div>
  //           {/* Output Component for editor json */}
  //           <EditorOutput data={JSON.stringify(post.content)} />
  //         </div>
  //         {/* Comment Buttons */}
  //         <div className="rounded-sm bg-red-400/60">
  //           Comment buttons displayed here
  //         </div>
  //       </Link>
  //     </div>
  //   </>
  // );
};

export default PostView;
