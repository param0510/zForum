import { Post, PostVote as PV } from "@prisma/client";
import Link from "next/link";
import EditorOutput from "../custom/EditorOutput";
import PostVote from "./PostVote";
import { Ref } from "react";

interface PostViewProps {
  post: Post;
  communityNameSlug: string;
  innerRef?: Ref<HTMLDivElement>;
}

const PostView = ({ post, communityNameSlug, innerRef }: PostViewProps) => {
  // #UPDATE: this will not work - client component
  // const postVotes = await db.postVote.findMany({
  //   where: {
  //     postId: post.id,
  //   },
  // });
  const postVotes: PV[] = [];

  return (
    // Side buttons for voting
    <>
      <div className="flex items-center gap-0.5" ref={innerRef}>
        <div className="flex grow-0 flex-col items-center justify-center gap-1.5">
          <PostVote votes={postVotes} postId={post.id} />
        </div>
        <Link
          href={`c/view/${communityNameSlug}/post/view?info=${post.id}`}
          className="flex grow flex-col gap-0"
        >
          {/* Post body */}
          <div className="flex max-h-[270px] flex-col gap-3 overflow-hidden rounded-md bg-white/10 p-6">
            <div className="flex justify-between gap-2">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <p className="flex gap-2">
                <span>u/{post.authorId}</span>
                <span>@</span>
                {/* @ts-ignore */}
                <span>{post.createdAt}</span>
              </p>
            </div>
            {/* Output Component for editor json */}
            <EditorOutput data={JSON.stringify(post.content)} />
          </div>
          {/* Comment Buttons */}
          <div className="rounded-sm bg-red-400/60">
            Comment buttons displayed here
          </div>
        </Link>
      </div>
    </>
  );
};

export default PostView;
