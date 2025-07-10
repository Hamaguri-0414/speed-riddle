'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  Clock, 
  Users, 
  Trophy, 
  Calendar,
  User,
  ArrowLeft,
  Play,
  BarChart3,
  CheckCircle2,
  Zap
} from 'lucide-react'
import { Header } from '@/components/layout/header'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { useAuth } from '@/hooks/use-auth'
import { formatTimeShort } from '@/lib/session-utils'

interface PuzzleDetail {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  isActive: boolean
  createdBy: string
  totalQuestions: number
  createdAt: string
  updatedAt: string
  stats: {
    totalPlayers: number
    bestTime: number
    averageTime: number
    completionRate: number
  }
}

export default function PuzzleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, signInAnonymously } = useAuth()
  
  const [puzzle, setPuzzle] = useState<PuzzleDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [imageError, setImageError] = useState(false)

  const puzzleId = params.id as string

  useEffect(() => {
    const fetchPuzzleDetail = async () => {
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
      } catch (err) {
        console.error('謎解き詳細取得エラー:', err)
        setError(err instanceof Error ? err.message : '謎解き詳細の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (puzzleId) {
      fetchPuzzleDetail()
    }
  }, [puzzleId])

  const handleStartPuzzle = async () => {
    try {
      setIsStarting(true)

      // 未認証の場合は匿名認証を実行
      if (!isAuthenticated) {
        await signInAnonymously()
      }

      // 謎解き画面に遷移（PR #6で実装予定）
      router.push(`/puzzles/${puzzleId}/solve`)
    } catch (error) {
      console.error('謎解き開始エラー:', error)
      alert('謎解きの開始に失敗しました。もう一度お試しください。')
    } finally {
      setIsStarting(false)
    }
  }

  const handleBackToList = () => {
    router.push('/')
  }

  const handleViewRanking = () => {
    router.push(`/puzzles/${puzzleId}/ranking`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </div>
        </main>
      </div>
    )
  }

  if (error || !puzzle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage 
            message={error || '謎解きが見つかりません'}
            onRetry={() => window.location.reload()}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 戻るボタン */}
        <button
          onClick={handleBackToList}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>謎解き一覧に戻る</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2">
            {/* 謎解き画像 */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="relative h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden mb-4">
                {!imageError && puzzle.thumbnailUrl ? (
                  <Image
                    src={puzzle.thumbnailUrl}
                    alt={puzzle.title}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🧩</div>
                      <div className="text-gray-500 text-lg">{puzzle.title}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* タイトルと説明 */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {puzzle.title}
              </h1>
              <p className="text-gray-700 leading-relaxed mb-6">
                {puzzle.description}
              </p>

              {/* 問題数バッジ */}
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {puzzle.totalQuestions}問
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  完成率 {puzzle.stats.completionRate}%
                </div>
              </div>

              {/* 作成者情報 */}
              <div className="flex items-center gap-2 text-sm text-gray-600 border-t pt-4">
                <User className="w-4 h-4" />
                <span>作成者: {puzzle.createdBy}</span>
                <Calendar className="w-4 h-4 ml-4" />
                <span>{new Date(puzzle.createdAt).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="lg:col-span-1">
            {/* アクションカード */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                謎解きを始める
              </h2>
              
              <button
                onClick={handleStartPuzzle}
                disabled={isStarting}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
              >
                {isStarting ? (
                  <>
                    <LoadingSpinner size="small" />
                    準備中...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    挑戦する
                  </>
                )}
              </button>

              <button
                onClick={handleViewRanking}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Trophy className="w-5 h-5" />
                ランキングを見る
              </button>

              {!isAuthenticated && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ⚡ 謎解きを始めると自動的に匿名アカウントが作成されます
                  </p>
                </div>
              )}
            </div>

            {/* 統計情報カード */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                統計情報
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>挑戦者数</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {puzzle.stats.totalPlayers.toLocaleString()}人
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Trophy className="w-4 h-4" />
                    <span>最速記録</span>
                  </div>
                  <span className="font-semibold text-blue-600">
                    {formatTimeShort(puzzle.stats.bestTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>平均タイム</span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatTimeShort(puzzle.stats.averageTime)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>完成率</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    {puzzle.stats.completionRate}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}