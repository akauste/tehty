import NextAuth from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [Github({
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
  }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })],
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: process.env.NODE_ENV === "production" ? ["tehty-akauste.vercel.app"] : true,

  // If needed by your provider setups or cookie domain, define here:
  // url: process.env.AUTH_URL ?? process.env.NEXTAUTH_URL,
})