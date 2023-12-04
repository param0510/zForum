import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function DELETE(
  req: Request,
  routeParams: { params: { cId: string } },
) {
  const communityId = routeParams.params.cId;
  const session = await getServerAuthSession();
  if (!session?.user) {
    return new Response("Unauthorized: Access Denied to delete community", {
      status: 401,
    });
  }
  try {
    const communityCreator = await db.community.findUnique({
      where: {
        id: communityId,
      },
      select: {
        creatorId: true,
      },
    });

    if (session.user.id === communityCreator?.creatorId) {
      const resp = await db.community.delete({
        where: {
          id: communityId,
        },
      });
      // user is the creator
      return new Response(
        `Community deleted successfully: ${JSON.stringify(resp)}`,
        { status: 200 },
      );
    }
    // the user is not the creator
    return new Response("User must be a creator to delete a community", {
      status: 403,
    });
  } catch (error) {
    return new Response("Couldn't delete the community", {
      status: 500,
    });
  }
}
