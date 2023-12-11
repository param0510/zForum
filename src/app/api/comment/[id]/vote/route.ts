import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { VotePayloadSchema } from "@/lib/validators/vote";
import { ZodError } from "zod";

export async function GET(
  req: Request,
  routeParams: { params: { id: string } },
) {
  try {
    const commentId = routeParams.params.id;
    const votes = await db.commentVote.findMany({
      where: {
        commentId,
      },
    });
    return new Response(JSON.stringify(votes), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  routeParams: { params: { id: string } },
) {
  const commentId = routeParams.params.id;
  const session = await getServerAuthSession();
  const payload = await req.json();
  if (!session?.user) {
    return new Response("Unauthorized user", { status: 401 });
  }
  try {
    const { voteType } = VotePayloadSchema.parse(payload);
    const existingVote = await db.commentVote.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId,
        },
      },
      select: {
        type: true,
      },
    });

    // if the user has already voted with the same VoteType remove the record
    if (existingVote?.type === voteType) {
      await db.commentVote.delete({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId,
          },
        },
      });

      return new Response(null, { status: 204 });
    }
    // if the same vote type doesn't exist in the record just upsert (create/update) the new value
    const upsertedVote = await db.commentVote.upsert({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId,
        },
      },
      update: {
        type: voteType,
      },
      create: {
        userId: session.user.id,
        commentId,
        type: voteType,
      },
    });
    return new Response(
      `Comment vote updated successfully ${JSON.stringify(upsertedVote)}`,
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
