import { db } from "@/lib/db";
import CommentView from "../client-side/CommentView";

interface CommentListProps {
  postId: string;
}

const CommentList = async ({ postId }: CommentListProps) => {
  const comments = await db.comment.findMany({
    where: {
      postId,
      AND: {
        replyToId: null,
      },
    },
    include: {
      author: {
        select: {
          image: true,
        },
      },
      replies: {
        include: {
          author: {
            select: {
              image: true,
            },
          },
        },
      },
    },
  });
  //   const {} = comments[0];
  return (
    <div>
      {comments.map((comment) => (
        // @ts-expect-error server side component
        <CommentView
          key={comment.id}
          comment={comment}
          replies={comment.replies}
        />
      ))}
    </div>
  );
};

export default CommentList;
