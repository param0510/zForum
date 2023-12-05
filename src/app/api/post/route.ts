import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  CreatePostPayloadSchema,
  GetPostsPayloadSchema,
} from "@/lib/validators/post";
import { ZodError } from "zod";

export async function POST(req: Request) {
  const session = await getServerAuthSession();

  const reqData = await req.json();
  if (!session?.user) {
    return new Response("User authentication is required", {
      status: 401,
    });
  }
  try {
    const { title, communityId, content, communityCreatorId } =
      CreatePostPayloadSchema.parse(reqData);

    // counting the existence of the signed in user as a subscriber
    const user_subcription_count = await db.subscription.count({
      select: {
        _all: true,
      },
      where: {
        communityId,
        AND: {
          userId: session.user.id,
        },
      },
    });

    if (
      user_subcription_count._all !== 1 &&
      communityCreatorId !== session.user.id
    ) {
      return new Response(
        "User must be subscribed to the community to make a post",
        { status: 403 },
      );
    }
    const createdPost = await db.post.create({
      data: {
        title,
        content,
        communityId,
        authorId: session?.user.id,
      },
    });
    return new Response(
      `Post created successfully - ${JSON.stringify(createdPost)}`,
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(`Invalid data sent`, {
        status: 406,
      });
    }
    return new Response("Could not create post", {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const data = await req.json();
    const { communityId } = GetPostsPayloadSchema.parse(data);
    if (communityId) {
      const communityPosts = await db.post.findMany({
        where: {
          communityId,
        },
      });
      return new Response(JSON.stringify(communityPosts), {
        status: 200,
      });
    }
    const allPosts = await db.post.findMany();
    return new Response(JSON.stringify(allPosts), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(JSON.stringify(error), {
        status: 400,
      });
    }
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
}
