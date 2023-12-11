import CreateComment from "../client-side/CreateComment";
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
      <CommentList postId={postId} />
    </div>
  );
};

export default CommentSection;
