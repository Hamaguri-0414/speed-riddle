import { DefaultSession } from 'next-auth'

// NextAuth.jsの型拡張
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      isAnonymous: boolean
    } & DefaultSession['user']
  }

  interface User {
    isAnonymous: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    isAnonymous: boolean
  }
}

// セッション情報の型定義
export interface SessionInfo {
  userId: string
  isAnonymous: boolean
  name: string | null
}

// 認証状態の型定義
export interface AuthState {
  isAuthenticated: boolean
  session: SessionInfo | null
  isLoading: boolean
}