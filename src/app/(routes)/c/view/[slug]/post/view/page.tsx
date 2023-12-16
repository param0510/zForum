import PostVote from "@/components/client-side/PostVote";
import EditorOutput from "@/components/custom/EditorOutput";
import VoteClientShell from "@/components/custom/VoteClientShell";
import CommentSection from "@/components/server-side/CommentSection";
import { db } from "@/lib/db";
import { formatTimeToNow } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Required for vercel deployment to prevent stale data representation due to vercel's caching model
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

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
  const { id, createdAt, title, content, author } = postDetails;

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

          <EditorOutput data={JSON.stringify(content)} />
          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            {/* @ts-expect-error Server Component */}
            <CommentSection postId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default page;
