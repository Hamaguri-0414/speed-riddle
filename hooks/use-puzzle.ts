'use client'

import { useEffect, useState } from 'react'
import { usePuzzleStore } from '@/store/puzzle-store'
import { useAuth } from '@/hooks/use-auth'

interface PuzzleDetail {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  totalQuestions: number
  createdBy: string
  createdAt: string
  stats: {
    totalPlayers: number
    bestTime: number
    averageTime: number
    completionRate: number
  }
}

export function usePuzzle(puzzleId: string) {
  const [puzzle, setPuzzle] = useState<PuzzleDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { currentSession, startSession, clearSession } = usePuzzleStore()
  const { isAuthenticated, signInAnonymously } = useAuth()

  // 謎解き詳細を取得
  const fetchPuzzle = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/puzzles/${puzzleId}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('指定された謎解きが見つかりません')
        }
        throw new Error('謎解き詳細の取得に失敗しました')
      }
      
      const data = await response.json()
      setPuzzle(data.puzzle)
      return data.puzzle
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '謎解き詳細の取得に失敗しました'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // 謎解きを開始
  const startPuzzle = async (): Promise<boolean> => {
    try {
      // 未認証の場合は匿名認証を実行
      if (!isAuthenticated) {
        await signInAnonymously()
      }

      // 謎解き詳細がない場合は取得
      let puzzleData = puzzle
      if (!puzzleData) {
        puzzleData = await fetchPuzzle()
      }

      if (!puzzleData) {
        throw new Error('謎解き情報を取得できませんでした')
      }

      // 既存のセッションがあればクリア
      if (currentSession) {
        clearSession()
      }

      // 新しいセッションを開始
      startSession(puzzleId, puzzleData.totalQuestions)

      return true
    } catch (error) {
      console.error('謎解き開始エラー:', error)
      setError(error instanceof Error ? error.message : '謎解きの開始に失敗しました')
      return false
    }
  }

  // 謎解きセッションをリセット
  const resetPuzzle = () => {
    clearSession()
    setError(null)
  }

  // コンポーネントマウント時に謎解き詳細を取得
  useEffect(() => {
    if (puzzleId) {
      fetchPuzzle()
    }
  }, [puzzleId])

  return {
    // 状態
    puzzle,
    currentSession,
    isLoading,
    error,
    
    // アクション
    startPuzzle,
    resetPuzzle,
    fetchPuzzle,
    
    // 計算値
    isSessionActive: !!currentSession && !currentSession.isCompleted,
    canStart: !isLoading && !!puzzle && !currentSession,
  }
}

// 謎解き一覧用のフック
export function usePuzzleList() {
  const [puzzles, setPuzzles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPuzzles = async (params?: { page?: number; limit?: number; search?: string }) => {
    try {
      setIsLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set('page', params.page.toString())
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.search) searchParams.set('search', params.search)

      const response = await fetch(`/api/puzzles?${searchParams}`)
      if (!response.ok) {
        throw new Error('謎解き一覧の取得に失敗しました')
      }

      const data = await response.json()
      setPuzzles(data.puzzles || [])
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '謎解き一覧の取得に失敗しました'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPuzzles()
  }, [])

  return {
    puzzles,
    isLoading,
    error,
    fetchPuzzles,
  }
}