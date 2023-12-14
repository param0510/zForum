import { CreatePost } from "@/components/client-side/CreatePost";
import { Button, buttonVariants } from "@/components/custom/Button";
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
    <div className="flex flex-col items-start gap-6">
      {/* heading */}
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in c/{slug}
          </p>
        </div>
      </div>

      {/* form */}
      <CreatePost communityId={communityObj.id} communityName={slug} />
    </div>
  );
};

export default CreatePostPage;
