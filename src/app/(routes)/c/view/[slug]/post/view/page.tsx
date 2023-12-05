import PostVoteClient from "@/components/client-side/PostVoteClient";
import EditorOutput from "@/components/custom/EditorOutput";
import CommentSection from "@/components/server-side/CommentSection";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

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
  });
  if (!postDetails) {
    return notFound();
  }
  const { id, authorId, createdAt, title, content } = postDetails;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex shrink flex-col items-center justify-center gap-1.5">
          {/* #REFRACTOR FETCH THE VOTE DATA INSIDE THIS COMPONENT */}
          <PostVoteClient votes={undefined} postId={id} />
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
