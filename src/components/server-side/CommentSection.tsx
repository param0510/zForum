import { db } from "@/lib/db";
import CreateComment from "../client-side/CreateComment";
import CommentView from "../client-side/CommentView";
import CommentList from "./CommentList";

interface CommentSectionProps {
  postId: string;
}

const CommentSection = ({ postId }: CommentSectionProps) => {
  return (
    <div>
      {/* Create Comment component */}
      <CreateComment postId={postId} />
      {/* Comment view list */}
      {/* Content from Comment list can be directly moved into this component. #REFRACTOR */}
      {/* @ts-expect-error ssr component */}
      <CommentList postId={postId} />
    </div>
  );
};

export default CommentSection;
