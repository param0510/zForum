import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateCommentPayloadSchema } from "@/lib/validators/comment";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

export async function GET(
  req: NextRequest,
  routeParams: { params: { postId: string } },
) {
  try {
    const replyToId = req.nextUrl.searchParams.get("replyToId");
    const PAGE_ITEMS = replyToId ? 2 : 5;
    const postId = routeParams.params.postId;

    const page = req.nextUrl.searchParams.get("page");

    // default pageNo = 1
    var pageNo = 1;
    if (page) {
      const pageInt = parseInt(page);
      if (isNaN(pageInt) || pageInt <= 0) {
        return new Response(
          "Invalid request: page paramter should be positive number greater than 0",
          { status: 400 },
        );
      }
      pageNo = pageInt;
    }

    const comments = await db.comment.findMany({
      where: {
        postId,
        AND: {
          replyToId,
        },
      },
      include: {
        author: {
          select: {
            image: true,
            username: true,
          },
        },
      },
      skip: (pageNo - 1) * PAGE_ITEMS,
      take: PAGE_ITEMS,
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}

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
