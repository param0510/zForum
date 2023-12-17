import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
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
