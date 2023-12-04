import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostVotePayloadSchema } from "@/lib/validators/vote";
import { ZodError } from "zod";

export async function PATCH(
  req: Request,
  routeParams: { params: { postId: string } },
) {
  const postId = routeParams.params.postId;
  const session = await getServerAuthSession();
  const payload = await req.json();
  if (!session?.user) {
    return new Response("Unauthorized user", { status: 401 });
  }
  try {
    const { voteType } = PostVotePayloadSchema.parse(payload);
    const existingVote = await db.postVote.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
      select: {
        type: true,
      },
    });

    // if the user has already voted with the same VoteType remove the record
    if (existingVote?.type === voteType) {
      await db.postVote.delete({
        where: {
          userId_postId: {
            userId: session.user.id,
            postId,
          },
        },
      });
      return new Response("Post vote removed successfully", { status: 204 });
    }
    // if the same vote type doesn't exist in the record just upsert (create/update) the new value
    const upsertedVote = await db.postVote.upsert({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
      update: {
        type: voteType,
      },
      create: {
        userId: session.user.id,
        postId,
        type: voteType,
      },
    });
    return new Response(
      `Post vote updated successfully ${JSON.stringify(upsertedVote)}`,
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(`Invalid vote sent`, { status: 400 });
    }
    return new Response(`Something went wrong, try again later`, {
      status: 500,
    });
  }
}
