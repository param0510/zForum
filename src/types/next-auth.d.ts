import { Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";

// this module - "next-auth" has a scope of this project
// So we edit the interface or types by extending them. So that we can customize them to the scope of this application and use our own set of customized, "Session" interface rather than using the one that is provided .
declare module "next-auth" {
  interface Session {
    // This just updates the user property inside the Session interface and the rest remain the same. For example: (expires) property remains untouched.
    // & operator helps in extending the User interface with 2 new properties (id, username)
    user: User & {
      id: string;
      username: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}
