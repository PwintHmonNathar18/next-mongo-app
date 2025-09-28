// auth.js
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,                          // ✅ required in v5 (you already generated it)
  trustHost: !!process.env.AUTH_TRUST_HOST || !!process.env.AUTH_URL, // ✅ for local/dev URLs

  providers: [
    GitHub({
      // Keep your env names, but add fallbacks so either style works
      clientId: process.env.GITHUB_CLIENT_ID || process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET || process.env.AUTH_GITHUB_SECRET,
    })
  ],

  callbacks: {
    async session({ session, token }) {
      // Return the session with user info
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
  },

  debug: process.env.NODE_ENV === 'development',
})
