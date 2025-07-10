'use client'

import { useEffect, useState } from 'react'
import { PuzzleCard } from '@/components/puzzle/puzzle-card'
import { Header } from '@/components/layout/header'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { useAuth } from '@/hooks/use-auth'
import { Puzzle } from '@/types/store'

export default function HomePage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPuzzles = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/puzzles')
        if (!response.ok) {
          throw new Error('謎解き一覧の取得に失敗しました')
        }
        
        const data = await response.json()
        setPuzzles(data.puzzles || [])
      } catch (err) {
        console.error('謎解き一覧取得エラー:', err)
        setError(err instanceof Error ? err.message : '謎解き一覧の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPuzzles()
  }, [])

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage 
            message={error}
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
        {/* ヒーローセクション */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Speed Riddle
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            謎解きの速さを競おう！様々な謎解きに挑戦して、
            あなたのスピードをランキングで確認できます。
          </p>
          <div className="flex justify-center gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{puzzles.length}</div>
              <div className="text-sm text-gray-600">謎解き数</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {isAuthenticated ? '参加中' : 'ゲスト'}
              </div>
              <div className="text-sm text-gray-600">ステータス</div>
            </div>
          </div>
        </section>

        {/* 謎解き一覧セクション */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              謎解き一覧
            </h2>
            {puzzles.length > 0 && (
              <p className="text-gray-600">
                {puzzles.length}件の謎解きが見つかりました
              </p>
            )}
          </div>

          {puzzles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🧩</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                謎解きがまだありません
              </h3>
              <p className="text-gray-600 mb-6">
                最初の謎解きを作成して、Speed Riddleを始めましょう！
              </p>
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => window.location.href = '/puzzles/create'}
              >
                謎解きを作成する
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {puzzles.map((puzzle) => (
                <PuzzleCard 
                  key={puzzle.id} 
                  puzzle={puzzle}
                />
              ))}
            </div>
          )}
        </section>

        {/* フッター情報 */}
        <section className="mt-16 text-center text-gray-500">
          <p className="text-sm">
            Speed Riddle - 謎解きスピード競争サイト
          </p>
        </section>
      </main>
    </div>
  )
}