// src/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    accessToken: string;
    refreshToken: string;
    phone?: string;
    role?: string;
    name?: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id?: string;
      phone?: string;
      role?: string;
      name?: string | null;
    };
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string;
    refreshToken: string;
    phone?: string;
    role?: string;
    name?: string | null;
  }
}
