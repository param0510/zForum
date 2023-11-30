import { CreatePost } from "@/components/client-side/CreatePost";
import { buttonVariants } from "@/components/custom/Button";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CreatePostPageProps {
  params: {
    slug: string;
  };
}

const CreatePostPage = async ({ params: { slug } }: CreatePostPageProps) => {
  const communityObj = await db.community.findUnique({
    where: {
      name: slug,
    },
    select: {
      id: true,
    },
  });
  if (!communityObj) {
    return notFound();
  }
  return (
    <>
      <Link
        className={cn("w-fit", buttonVariants({ variant: "ghost" }))}
        href={`/c/view/${slug}`}
      >
        {"<"} Back to community
      </Link>
      <h3>
        <strong className="font-semibold">Create Post</strong>{" "}
        <span className="text-xs">in r/TestCommunity</span>
      </h3>
      <CreatePost />
    </>
  );
};

export default CreatePostPage;
