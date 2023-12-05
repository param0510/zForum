import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateCommentPayloadSchema } from "@/lib/validators/comment";
import { ZodError } from "zod";

export async function POST(
  req: Request,
  routeParams: { params: { postId: string } },
) {
  const session = await getServerAuthSession();
  if (!session) {
    return new Response("Unautorized user", { status: 401 });
  }
  const postId = routeParams.params.postId;
  try {
    const payload = await req.json();
    const { text, replyToId } = CreateCommentPayloadSchema.parse(payload);
    const createdComment = await db.comment.create({
      data: {
        authorId: session.user.id,
        text,
        postId,
        replyToId,
      },
    });
    return new Response(JSON.stringify(createdComment), { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Comment text is required", { status: 400 });
    }
    return new Response(
      "Something went wrong with the server, try again later",
      { status: 500 },
    );
  }
}
