import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role_id?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role_id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role_id?: string;
  }
}
