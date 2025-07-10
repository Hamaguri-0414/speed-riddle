import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { SessionInfo } from '@/types/auth'

// サーバーサイドでセッション情報を取得
export async function getSessionInfo(): Promise<SessionInfo | null> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return null
  }

  return {
    userId: session.user.id,
    isAnonymous: session.user.isAnonymous,
    name: session.user.name,
  }
}

// 認証が必要なAPIで使用するヘルパー関数
export async function requireAuth(): Promise<SessionInfo> {
  const sessionInfo = await getSessionInfo()
  
  if (!sessionInfo) {
    throw new Error('認証が必要です')
  }
  
  return sessionInfo
}

// 匿名ユーザーのIDを生成
export function generateAnonymousId(): string {
  return `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 匿名ユーザーの名前を生成
export function generateAnonymousName(userId: string): string {
  return `Anonymous-${userId.slice(-8)}`
}

// セッションの有効性をチェック
export function isValidSession(session: any): boolean {
  return !!(session?.user?.id)
}

// 匿名ユーザーかどうかをチェック
export function isAnonymousUser(session: any): boolean {
  return session?.user?.isAnonymous === true
}

// ユーザー名の表示用フォーマット
export function formatDisplayName(name: string | null, isAnonymous: boolean): string {
  if (!name) {
    return isAnonymous ? '匿名ユーザー' : 'ユーザー'
  }
  
  return name
}

// セッションの期限切れをチェック
export function isSessionExpired(session: any): boolean {
  if (!session?.expires) {
    return true
  }
  
  return new Date(session.expires) < new Date()
}