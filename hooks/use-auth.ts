'use client'

import { useSession } from 'next-auth/react'
import { useAuthStore } from '@/store/auth-store'
import { useEffect } from 'react'
import { SessionInfo } from '@/types/auth'

export function useAuth() {
  const { data: session, status } = useSession()
  const { 
    isAuthenticated, 
    session: storeSession, 
    isLoading, 
    setSession, 
    clearSession, 
    setLoading,
    signInAnonymously,
    signOut 
  } = useAuthStore()

  // セッション状態の同期
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
      return
    }

    if (status === 'unauthenticated') {
      clearSession()
      return
    }

    if (session?.user) {
      const sessionInfo: SessionInfo = {
        userId: session.user.id,
        isAnonymous: session.user.isAnonymous,
        name: session.user.name,
      }
      setSession(sessionInfo)
    }
  }, [session, status, setSession, clearSession, setLoading])

  // 認証状態の計算
  const computedIsAuthenticated = status === 'authenticated' && !!session?.user
  const computedIsLoading = status === 'loading' || isLoading

  return {
    // 認証状態
    isAuthenticated: computedIsAuthenticated,
    isLoading: computedIsLoading,
    
    // セッション情報
    session: storeSession,
    user: session?.user || null,
    
    // アクション
    signInAnonymously,
    signOut,
    
    // ヘルパー関数
    isAnonymous: session?.user?.isAnonymous || false,
    userId: session?.user?.id || null,
    userName: session?.user?.name || null,
  }
}