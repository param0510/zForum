import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateCommunityPayloadSchema } from "@/lib/validators/community";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

// Create new community
export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session?.user) {
      return new Response("You are not authorized", {
        status: 401,
      });
    }
    // Enforce type safety here using Zod (By giving validation criteria as well)
    const reqPayload = await req.json();
    const { name: communityName } =
      CreateCommunityPayloadSchema.parse(reqPayload);

    // check if community name already exists
    const communityExists = await db.community.findFirst({
      where: { name: communityName },
    });
    if (communityExists) {
      return new Response("Community with this name already exists", {
        status: 409,
      });
    }
    const { name: createdCommunityName } = await db.community.create({
      data: {
        // make it type safe
        name: communityName,
        creatorId: session.user.id,
      },
    });
    // Addinging subscribers to the created community
    // CHECK THE BREADIT
    return new Response(createdCommunityName, {
      status: 201,
    });
  } catch (error) {
    // Type checking error code 400 (Invalid data sent from the client)
    if (error instanceof ZodError) {
      return new Response(
        "Invalid community name sent. It must be 3 to 26 characters long.",
        {
          status: 422,
        },
      );
    }
    return new Response("Could not create community", {
      status: 500,
    });
  }
}

// Get all the communities
export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get("name");
    const communities = await db.community.findMany({
      where: {
        name: {
          contains: name ?? undefined,
        },
      },
      take: 5, // kept a constant for now - Use it later for pagination
      orderBy: {
        createdAt: "desc",
      },
    });
    return new Response(JSON.stringify(communities), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
