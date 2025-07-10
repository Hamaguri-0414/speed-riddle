import { NextRequest, NextResponse } from 'next/server'
import { Puzzle } from '@/types/store'

// モックデータ（将来的にはデータベースから取得）
const mockPuzzles: Puzzle[] = [
  {
    id: '1',
    title: '数字の謎',
    description: '隠された数字のパターンを見つけて答えを導き出そう。論理的思考が試される問題です。',
    thumbnailUrl: '/images/puzzles/numbers.jpg',
    isActive: true,
    createdBy: 'Anonymous-12345678',
    totalQuestions: 3,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: '文字の暗号',
    description: '暗号化された文字列を解読せよ。古典的な暗号技術を使った謎解きです。',
    thumbnailUrl: '/images/puzzles/cipher.jpg',
    isActive: true,
    createdBy: 'Anonymous-87654321',
    totalQuestions: 4,
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
  },
  {
    id: '3',
    title: '図形の規則',
    description: '図形の配置から隠れた規則を発見しよう。空間認識能力が問われます。',
    thumbnailUrl: '/images/puzzles/shapes.jpg',
    isActive: true,
    createdBy: 'Anonymous-11223344',
    totalQuestions: 5,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    title: '言葉遊び',
    description: '日本語の特性を活かした言葉の謎解き。ひらめきと知識が必要です。',
    thumbnailUrl: '/images/puzzles/wordplay.jpg',
    isActive: true,
    createdBy: 'Anonymous-55667788',
    totalQuestions: 3,
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
  },
  {
    id: '5',
    title: '論理パズル',
    description: '条件を整理して正解を導く論理パズル。推理力が試されます。',
    thumbnailUrl: '/images/puzzles/logic.jpg',
    isActive: true,
    createdBy: 'Anonymous-99887766',
    totalQuestions: 6,
    createdAt: '2024-01-11T11:45:00Z',
    updatedAt: '2024-01-11T11:45:00Z',
  },
  {
    id: '6',
    title: '絵の中の秘密',
    description: '一見普通の絵の中に隠された謎を見つけよう。観察力が重要です。',
    thumbnailUrl: '/images/puzzles/picture.jpg',
    isActive: true,
    createdBy: 'Anonymous-44332211',
    totalQuestions: 4,
    createdAt: '2024-01-10T16:10:00Z',
    updatedAt: '2024-01-10T16:10:00Z',
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    // 検索フィルタリング
    let filteredPuzzles = mockPuzzles.filter(puzzle => 
      puzzle.isActive && (
        puzzle.title.toLowerCase().includes(search.toLowerCase()) ||
        puzzle.description.toLowerCase().includes(search.toLowerCase())
      )
    )

    // 作成日時でソート（新しい順）
    filteredPuzzles.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // ページネーション
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPuzzles = filteredPuzzles.slice(startIndex, endIndex)

    // レスポンス
    const response = {
      success: true,
      puzzles: paginatedPuzzles,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredPuzzles.length / limit),
        totalCount: filteredPuzzles.length,
        hasNext: endIndex < filteredPuzzles.length,
        hasPrevious: page > 1,
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('謎解き一覧取得エラー:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '謎解き一覧の取得に失敗しました' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // 将来的な謎解き作成API（PR #11で実装予定）
    return NextResponse.json(
      { 
        success: false, 
        error: '謎解きの作成機能はまだ実装されていません' 
      },
      { status: 501 }
    )
  } catch (error) {
    console.error('謎解き作成エラー:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '謎解きの作成に失敗しました' 
      },
      { status: 500 }
    )
  }
}