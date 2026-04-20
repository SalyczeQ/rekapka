import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, verificationTokens } from "@/lib/db/schema";
import { logAudit, AUDIT_ACTIONS } from "@/lib/audit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      await logAudit({
        actor: { id: user.id ?? null, email: user.email ?? null, name: user.name ?? null },
        action: AUDIT_ACTIONS.SIGN_IN,
        entityType: "user",
        entityId: user.id ?? null,
        metadata: { provider: account?.provider ?? null, isNewUser: Boolean(isNewUser) },
      });
    },
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      await logAudit({
        actor: token
          ? { id: (token.id as string | undefined) ?? null, email: token.email ?? null, name: token.name ?? null }
          : null,
        action: AUDIT_ACTIONS.SIGN_OUT,
      });
    },
  },
  pages: {
    signIn: "/login",
  },
});
