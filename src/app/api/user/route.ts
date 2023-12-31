import { getServerAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UpdateUserPayloadSchema } from "@/lib/validators/user";
import { ZodError } from "zod";

export async function PATCH(req: Request) {
  const session = await getServerAuthSession();
  if (!session) {
    return new Response("Unauthorized user", { status: 401 });
  }
  try {
    const reqData = await req.json();
    const { username } = UpdateUserPayloadSchema.parse(reqData);

    const usernameExists = await db.user.findFirst({
      where: {
        username,
      },
    });
    if (usernameExists) {
      return new Response("Username already exists", { status: 409 });
    }

    const updateUser = await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username,
      },
    });
    return new Response(JSON.stringify(updateUser), { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(error.message, { status: 400 });
    }
    return new Response(`Something went wrong, try again later`, {
      status: 500,
    });
  }
}
