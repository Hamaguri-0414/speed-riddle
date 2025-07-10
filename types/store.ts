// 共通の型定義
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// 謎解きセッション関連の型定義
export interface PuzzleSession extends BaseEntity {
  puzzleId: string
  userId: string
  startedAt: string
  completedAt: string | null
  currentQuestionIndex: number
  totalQuestions: number
  segmentTimes: number[]
  answers: string[]
  isCompleted: boolean
  totalTime: number
}

// 謎解きの型定義
export interface Puzzle extends BaseEntity {
  title: string
  description: string
  thumbnailUrl: string
  isActive: boolean
  createdBy: string
  totalQuestions: number
}

// 問題の型定義
export interface Question extends BaseEntity {
  puzzleId: string
  order: number
  imageUrl: string
  answerFormat: string[]
}

// 解答の型定義
export interface Answer extends BaseEntity {
  questionId: string
  correctAnswer: string
  alternativeAnswers: string[]
}

// ランキングエントリの型定義
export interface RankingEntry extends BaseEntity {
  puzzleId: string
  sessionId: string
  userName: string
  totalTime: number
  rank: number
  isAnonymous: boolean
  segmentTimes: number[]
}

// APIレスポンスの型定義
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// ページネーションの型定義
export interface PaginationData<T> {
  items: T[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}