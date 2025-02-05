import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },

  events: {
    async linkAccount({ user })
    {await db.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    })
  }},
  callbacks: {
    async session( { token, session } ) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },

    async jwt(token) {
      console.log({token})
      token.customField = "test";
      return token;
    }
  },

  adapter: PrismaAdapter({ prisma: db }),
  session: { strategy: "jwt" },
  ...authConfig,
});
