'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, Trophy, PlayCircle } from 'lucide-react'
import { Puzzle } from '@/types/store'
import { formatTimeShort } from '@/lib/session-utils'

interface PuzzleCardProps {
  puzzle: Puzzle
}

export function PuzzleCard({ puzzle }: PuzzleCardProps) {
  const [imageError, setImageError] = useState(false)

  // モックデータ（実際はAPIから取得）
  const mockStats = {
    totalPlayers: Math.floor(Math.random() * 1000) + 50,
    bestTime: Math.floor(Math.random() * 180000) + 30000, // 30秒～3分
    averageTime: Math.floor(Math.random() * 300000) + 60000, // 1分～5分
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      {/* サムネイル画像 */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {!imageError && puzzle.thumbnailUrl ? (
          <Image
            src={puzzle.thumbnailUrl}
            alt={puzzle.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <div className="text-center">
              <div className="text-4xl mb-2">🧩</div>
              <div className="text-gray-500 text-sm">謎解き</div>
            </div>
          </div>
        )}
        
        {/* 問題数バッジ */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs font-medium">
          {puzzle.totalQuestions}問
        </div>
        
        {/* ホバー時の再生ボタン */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <PlayCircle className="w-16 h-16 text-white" />
        </div>
      </div>

      {/* カード内容 */}
      <div className="p-6">
        {/* タイトルと説明 */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
            {puzzle.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {puzzle.description}
          </p>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span>{mockStats.totalPlayers.toLocaleString()}人</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Trophy className="w-4 h-4" />
            <span>{formatTimeShort(mockStats.bestTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 col-span-2">
            <Clock className="w-4 h-4" />
            <span>平均 {formatTimeShort(mockStats.averageTime)}</span>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2">
          <Link 
            href={`/puzzles/${puzzle.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            挑戦する
          </Link>
          <Link 
            href={`/puzzles/${puzzle.id}/ranking`}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Trophy className="w-5 h-5" />
          </Link>
        </div>

        {/* 作成者情報 */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              作成者: {puzzle.createdBy || '匿名'}
            </span>
            <span>
              {new Date(puzzle.createdAt).toLocaleDateString('ja-JP')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}