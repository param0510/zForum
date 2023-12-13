import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  routeParams: { params: { cId: string } },
) {
  const session = await getServerAuthSession();
  const communityId = routeParams.params.cId;

  if (!session?.user) {
    return new Response("Unauthorized User", { status: 401 });
  }
  try {
    const subcriptionExists = await db.subscription.findUnique({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId,
        },
      },
    });
    var response: boolean = subcriptionExists ? true : false;
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    return new Response("Error fetching subscription info, try again later", {
      status: 500,
    });
  }
}

// toggles the user subscription from the community
export async function PATCH(
  req: Request,
  routeParams: { params: { cId: string } },
) {
  const session = await getServerAuthSession();
  const communityId = routeParams.params.cId;
  if (!session?.user) {
    return new Response(
      "User authentication required for subcription to community",
      { status: 401 },
    );
  }
  try {
    const activeSubscription = await db.subscription.findUnique({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId,
        },
      },
    });
    if (!activeSubscription) {
      const createdSubscription = await db.subscription.create({
        data: { communityId, userId: session.user.id },
      });
      return new Response("User subcription created", { status: 201 });
    }
    const deleteSubscription = await db.subscription.delete({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId,
        },
      },
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return new Response("Unable to toggle user subscription, try again later", {
      status: 500,
    });
  }
}
