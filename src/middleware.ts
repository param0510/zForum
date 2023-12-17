import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // ANOTHER SOLUTION:

  // if (
  //   !req.cookies.has("next-auth.session-token") &&
  //   req.cookies.has("__Secure-next-auth.session-token")
  // ) {
  //   console.log("Relaying auth cookie...");
  //   req.cookies.set({
  //     ...req.cookies.get("__Secure-next-auth.session-token")!,
  //     name: "next-auth.session-token",
  //   });
  // }

  // // Getting the token
  // const token = await getToken({ req: req, secret: process.env.NEXTAUTH_SECRET });

  const token = await getToken({
    req,
    raw: true, // this is becomes necessary for vercel deployment as there are some hidden settings in vercel which interfere with the getToken() function
  });

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/c/:path*/create", "/c/create"],
};
