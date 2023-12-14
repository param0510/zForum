import EditorOutput from "@/components/custom/EditorOutput";
import CommentSection from "@/components/server-side/CommentSection";
import PostVote from "@/components/client-side/PostVote";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { formatTimeToNow } from "@/lib/utils";
import { ArrowBigDown, ArrowBigUp, Loader2, StarHalf } from "lucide-react";
import { buttonVariants } from "@/components/custom/Button";
import VoteClientShell from "@/components/custom/VoteClientShell";

interface pageProps {
  searchParams: {
    info: string;
  };
}

const page = async ({ searchParams: { info } }: pageProps) => {
  const postDetails = await db.post.findUnique({
    where: {
      id: info,
    },
    select: {
      id: true,
      authorId: true,
      createdAt: true,
      title: true,
      content: true,
      votes: true,
      author: {
        select: {
          username: true,
        },
      },
    },
  });
  if (!postDetails) {
    return notFound();
  }
  const { id, authorId, createdAt, title, content, author } = postDetails;

  return (
    <div>
      <div className="flex h-full flex-col items-center justify-between sm:flex-row sm:items-start">
        <Suspense fallback={<VoteClientShell />}>
          {/* ts-expect-error server component */}
          {/* <PostVoteServer
            postId={id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id,
                },
                include: {
                  votes: true,
                },
              });
            }}
          /> */}

          {/* Implement a server side component later when using redis */}
          <PostVote postId={id} />
        </Suspense>

        <div className="w-full flex-1 rounded-sm bg-white p-4 sm:w-0">
          <p className="mt-1 max-h-40 truncate text-xs text-gray-500">
            Posted by u/{author.username} {formatTimeToNow(new Date(createdAt))}
          </p>
          <h1 className="py-2 text-xl font-semibold leading-6 text-gray-900">
            {title}
          </h1>

          <EditorOutput data={content} />
          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            {/* ts-expect-error Server Component */}
            <CommentSection postId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex shrink flex-col items-center justify-center gap-1.5">
          <PostVote postId={id} />
        </div>
        {/* Post Details */}
        <div className="flex grow flex-col gap-3 rounded-md bg-white/10 p-6">
          {/* Post Header */}
          <div className="flex justify-between gap-2">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <p className="flex gap-2">
              <span>u/{authorId}</span>
              <span>@</span>
              <span>{createdAt.toISOString()}</span>
            </p>
          </div>
          {/* Output Component for editor json */}
          <EditorOutput data={JSON.stringify(content)} />
        </div>
      </div>
      {/* Comment Buttons */}
      <div className="rounded-md bg-white/10 p-2">
        <CommentSection postId={id} />
      </div>
    </div>
  );
};

export default page;
