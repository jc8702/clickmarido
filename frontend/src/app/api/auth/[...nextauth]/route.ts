import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const dynamic = 'force-dynamic';

const clientId = process.env.GOOGLE_CLIENT_ID || "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

if (!clientId || !clientSecret) {
  console.warn("⚠️ AVISO: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET não estão definidos no ambiente!");
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "clickmarido-super-secret-key-2026-xyz987!",
  debug: true,
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/calendar.events"
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      return session;
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
