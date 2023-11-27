import Link from "next/link";
import { buttonVariants } from "../custom/Button";

export const CreatePost = () => {
  return (
    <Link href={"/c/post/create"} className={buttonVariants()}>
      Create Post
    </Link>
  );
};
