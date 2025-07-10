import { NextRequest, NextResponse } from 'next/server'
import { Puzzle, Question, Answer } from '@/types/store'

// モックデータ（将来的にはデータベースから取得）
const mockPuzzles: (Puzzle & { questions: (Question & { answers: Answer[] })[] })[] = [
  {
    id: '1',
    title: '数字の謎',
    description: '隠された数字のパターンを見つけて答えを導き出そう。論理的思考が試される問題です。数字の規則性を理解すれば、必ず答えにたどり着けます。',
    thumbnailUrl: '/images/puzzles/numbers.jpg',
    isActive: true,
    createdBy: 'Anonymous-12345678',
    totalQuestions: 3,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    questions: [
      {
        id: '1-1',
        puzzleId: '1',
        order: 1,
        imageUrl: '/images/questions/1-1.jpg',
        answerFormat: ['数字'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        answers: [
          {
            id: '1-1-a',
            questionId: '1-1',
            correctAnswer: '42',
            alternativeAnswers: ['四十二', '42'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          }
        ]
      },
      {
        id: '1-2',
        puzzleId: '1',
        order: 2,
        imageUrl: '/images/questions/1-2.jpg',
        answerFormat: ['数字'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        answers: [
          {
            id: '1-2-a',
            questionId: '1-2',
            correctAnswer: '256',
            alternativeAnswers: ['二百五十六'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          }
        ]
      },
      {
        id: '1-3',
        puzzleId: '1',
        order: 3,
        imageUrl: '/images/questions/1-3.jpg',
        answerFormat: ['数字'],
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        answers: [
          {
            id: '1-3-a',
            questionId: '1-3',
            correctAnswer: '17',
            alternativeAnswers: ['十七', '17'],
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z',
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: '文字の暗号',
    description: '暗号化された文字列を解読せよ。古典的な暗号技術を使った謎解きです。文字の置き換えや配置に注目してください。',
    thumbnailUrl: '/images/puzzles/cipher.jpg',
    isActive: true,
    createdBy: 'Anonymous-87654321',
    totalQuestions: 4,
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
    questions: [
      {
        id: '2-1',
        puzzleId: '2',
        order: 1,
        imageUrl: '/images/questions/2-1.jpg',
        answerFormat: ['ひらがな', 'カタカナ'],
        createdAt: '2024-01-14T15:30:00Z',
        updatedAt: '2024-01-14T15:30:00Z',
        answers: [
          {
            id: '2-1-a',
            questionId: '2-1',
            correctAnswer: 'なぞとき',
            alternativeAnswers: ['ナゾトキ', 'なぞ解き'],
            createdAt: '2024-01-14T15:30:00Z',
            updatedAt: '2024-01-14T15:30:00Z',
          }
        ]
      }
    ]
  }
  // 他の謎解きも同様に定義...
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const puzzleId = params.id

    // 指定IDの謎解きを検索
    const puzzle = mockPuzzles.find(p => p.id === puzzleId)

    if (!puzzle) {
      return NextResponse.json(
        { 
          success: false, 
          error: '指定された謎解きが見つかりません' 
        },
        { status: 404 }
      )
    }

    if (!puzzle.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'この謎解きは現在利用できません' 
        },
        { status: 403 }
      )
    }

    // 統計情報をモック生成
    const mockStats = {
      totalPlayers: Math.floor(Math.random() * 1000) + 50,
      bestTime: Math.floor(Math.random() * 180000) + 30000, // 30秒～3分
      averageTime: Math.floor(Math.random() * 300000) + 60000, // 1分～5分
      completionRate: Math.floor(Math.random() * 40) + 60, // 60-100%
    }

    const response = {
      success: true,
      puzzle: {
        ...puzzle,
        stats: mockStats,
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('謎解き詳細取得エラー:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '謎解き詳細の取得に失敗しました' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 将来的な謎解き更新API（PR #11で実装予定）
    return NextResponse.json(
      { 
        success: false, 
        error: '謎解きの更新機能はまだ実装されていません' 
      },
      { status: 501 }
    )
  } catch (error) {
    console.error('謎解き更新エラー:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '謎解きの更新に失敗しました' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 将来的な謎解き削除API（PR #11で実装予定）
    return NextResponse.json(
      { 
        success: false, 
        error: '謎解きの削除機能はまだ実装されていません' 
      },
      { status: 501 }
    )
  } catch (error) {
    console.error('謎解き削除エラー:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '謎解きの削除に失敗しました' 
      },
      { status: 500 }
    )
  }
}