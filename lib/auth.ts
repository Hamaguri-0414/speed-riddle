import { NextAuthOptions } from 'next-auth'
import { v4 as uuidv4 } from 'uuid'

// 匿名認証のための設定
export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'anonymous',
      name: 'Anonymous',
      type: 'credentials',
      credentials: {},
      async authorize() {
        // 匿名ユーザーのIDを生成
        const anonymousId = uuidv4()
        
        return {
          id: anonymousId,
          name: `Anonymous-${anonymousId.slice(0, 8)}`,
          email: null,
          image: null,
          isAnonymous: true,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAnonymous = user.isAnonymous
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.isAnonymous = token.isAnonymous as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30日間
  },
  secret: process.env.NEXTAUTH_SECRET,
}