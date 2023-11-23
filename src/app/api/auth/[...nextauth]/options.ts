import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { nanoid } from "nanoid";

export const authOptions: NextAuthOptions = {
  // secret for next-auth (required)
  secret: process.env.NEXTAUTH_SECRET,
  // database adapter for prisma - Helps create users in the database by next-auth. We don't need to manually create Users in the database. next-auth handles it through this
  adapter: PrismaAdapter(db),
  // This property helps us override the default pages for the signin/signout. Those pages are created by next-auth automatically under "localhost:3000/api/auth/signin" | relative path from app directory: "/api/auth/signout"
  pages: {
    signIn: "/sign-in",
  },
  // Sets the strategy to json-web-token
  session: {
    strategy: "jwt",
  },
  // You can set multiple providers here: Github | CredentialsProvider - "Used for custom login form" | Facebook ...
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  // Callbacks that run after "authentication means - (user signin)" OR "authorization means - (getting current session )" processes
  callbacks: {
    // this callback gets called first whenever there is next-auth operation like (sign-in | getServerSession | useSession)
    // this the json web token only works if the session.strategy (inside authOptions) is set to "jwt" (see above)
    // is run after authentication and whenever a new user is created in database on signup
    // handles the user data before getting passed onto the session callback below as a token
    // Returns => token: JWT
    async jwt({ token, user }) {
      // console.log("jwtProps", jwtProps);
      // user object only exists when signin event occurs, after this during getServerSession() or useSession() calls only token exists and (user = null)
      if (user) {
        // Initial setup when the user logs in
        const dbUser = await db.user.findUnique({
          where: {
            id: user.id,
          },
        });
        // Adding an id property to the token to be returned for the session
        token.id = user.id;
        // No user found? => return the token object
        if (!dbUser) {
          return token;
        }
        // if user exists, but doesn't have a username set by next-auth
        // We manually update the username field inside the prisma table, using a random id. Which can be updated later
        if (!dbUser.username) {
          const randomUsername = nanoid(10);
          await db.user.update({
            where: {
              id: dbUser.id,
            },
            data: {
              username: randomUsername,
            },
          });
          // Adding the generated username to be passed on to the session
          token.username = randomUsername;
        } else {
          token.username = dbUser.username;
        }
      }

      // Returns the token everytime. Just on inital setup (when user exists) -> few properties are added. Basic properties like name, email, image (from user object) are by default handled by next-auth so we don't need to manually configure those properties inside the token
      return token;
    },
    // this callback handles the session object we use inside the entire application
    // It gets the token object from the above callback and returns a session object
    // We edit this callbacks to return session objects of our own types
    async session({ token, session }) {
      // Returning all the properties of default session object (handled by next-auth).
      // Plus we add our own custom properties carried over from the token object
      // So we edit the user object inside the session object. I have used spread operator to do so.
      // return session;
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          username: token.username,
        },
      };
    },
    // Redirect callback function. Called after every sucessful (signin/signout)
    // async redirect({ url, baseUrl }) {
    //   // console.log("redirect called:", { url, baseUrl });

    //   return "/";
    // },
  },
};
