import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { voteCounter } from "@/lib/utils";
import CommentView from "../client-side/CommentView";
import CreateComment from "../client-side/CreateComment";

interface CommentSectionProps {
  postId: string;
}

const CommentSection = async ({ postId }: CommentSectionProps) => {
  const session = await getServerAuthSession();
  const comments = await db.comment.findMany({
    where: {
      postId,
      AND: {
        replyToId: null, // fetch only top level comments
      },
    },
    include: {
      author: true,
      votes: true,
      replies: {
        // first level replies fetching
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <hr className="my-6 h-px w-full" />

      <CreateComment postId={postId} />

      <div className="mt-4 flex flex-col gap-y-6">
        {comments
          .filter((comment) => !comment.replyToId) // CHECK IF THIS ONE'S NEEDED
          .map((topLevelComment) => {
            //  const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
            //    (acc, vote) => {
            //      if (vote.type === "UP") return acc + 1;
            //      if (vote.type === "DOWN") return acc - 1;
            //      return acc;
            //    },
            //    0,
            //  );
            const topLevelCommentVotesAmt = voteCounter(
              topLevelComment.votes.map(({ type }) => type),
            );

            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id,
            );

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <CommentView
                    comment={topLevelComment}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmt}
                    postId={postId}
                  />
                </div>

                {/* Render replies */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length) // Sort replies by most actively liked/disliked
                  .map((reply) => {
                    //  const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                    //    if (vote.type === "UP") return acc + 1;
                    //    if (vote.type === "DOWN") return acc - 1;
                    //    return acc;
                    //  }, 0);

                    const replyVotesAmt = voteCounter(
                      reply.votes.map(({ type }) => type),
                    );
                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id,
                    );

                    return (
                      <div
                        key={reply.id}
                        className="ml-2 border-l-2 border-zinc-200 py-2 pl-4"
                      >
                        <CommentView
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
