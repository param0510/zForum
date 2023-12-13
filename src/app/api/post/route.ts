import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  CreatePostPayloadSchema,
  GetPostsPayloadSchema,
} from "@/lib/validators/post";
import { NextRequest } from "next/server";
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

// sample url: api/post?c="COMMUNITY_ID"&page="PAGE_NO"
export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();
  const PAGE_ITEMS = INFINITE_SCROLL_PAGINATION_RESULTS;
  const communityId = req.nextUrl.searchParams.get("c");
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

  try {
    // general feed view data where_condition
    var whereCondition = {};

    // community post page where_condition
    if (communityId) {
      whereCondition = {
        communityId,
      };
    }
    // if user is logged - Custom feed view data where_condition
    else if (session?.user) {
      const followedCommunities = await db.subscription.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          communityId: true,
        },
      });

      whereCondition = {
        communityId: {
          in: followedCommunities.map(({ communityId }) => communityId),
        },
      };
    }
    const posts = await db.post.findMany({
      where: whereCondition,
      include: {
        community: {
          select: {
            name: true,
          },
        },
        author: {
          select: {
            username: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (pageNo - 1) * PAGE_ITEMS,
      take: PAGE_ITEMS,
    });
    return new Response(JSON.stringify(posts), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(error.message, {
        status: 400,
      });
    }
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
}
