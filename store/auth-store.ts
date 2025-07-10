import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { AuthState, SessionInfo } from '@/types/auth'

interface AuthStore extends AuthState {
  // アクション
  setSession: (session: SessionInfo | null) => void
  clearSession: () => void
  setLoading: (isLoading: boolean) => void
  signInAnonymously: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 初期状態
        isAuthenticated: false,
        session: null,
        isLoading: false,

        // セッションを設定
        setSession: (session) => {
          set({
            session,
            isAuthenticated: !!session,
            isLoading: false,
          })
        },

        // セッションをクリア
        clearSession: () => {
          set({
            session: null,
            isAuthenticated: false,
            isLoading: false,
          })
        },

        // ローディング状態を設定
        setLoading: (isLoading) => {
          set({ isLoading })
        },

        // 匿名でサインイン
        signInAnonymously: async () => {
          set({ isLoading: true })
          try {
            const { signIn } = await import('next-auth/react')
            const result = await signIn('anonymous', { 
              redirect: false,
              callbackUrl: '/' 
            })
            
            if (result?.error) {
              throw new Error(result.error)
            }
          } catch (error) {
            console.error('匿名サインインエラー:', error)
            set({ isLoading: false })
            throw error
          }
        },

        // サインアウト
        signOut: async () => {
          set({ isLoading: true })
          try {
            const { signOut } = await import('next-auth/react')
            await signOut({ redirect: false })
            get().clearSession()
          } catch (error) {
            console.error('サインアウトエラー:', error)
            set({ isLoading: false })
            throw error
          }
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          session: state.session,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
)