import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// 謎解きセッション関連の型定義
interface PuzzleSession {
  id: string
  puzzleId: string
  startTime: number
  startedAt: Date
  currentQuestionIndex: number
  totalQuestions: number
  segmentTimes: number[]
  answers: string[]
  correctAnswers: number
  currentAnswer: string
  isCompleted: boolean
}

interface PuzzleStore {
  // 現在の謎解きセッション
  currentSession: PuzzleSession | null
  
  // アクション
  startSession: (puzzleId: string, totalQuestions: number) => void
  updateAnswer: (answer: string) => void
  submitAnswer: (answer: string, isCorrect: boolean) => void
  nextQuestion: () => void
  completeSession: () => void
  clearSession: () => void
  
  // セグメントタイムの記録
  recordSegmentTime: (questionIndex: number, timeMs: number) => void
}

export const usePuzzleStore = create<PuzzleStore>()(
  devtools(
    (set, get) => ({
      // 初期状態
      currentSession: null,

      // セッションを開始
      startSession: (puzzleId, totalQuestions) => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const startTime = Date.now()
        
        set({
          currentSession: {
            id: sessionId,
            puzzleId,
            startTime,
            startedAt: new Date(),
            currentQuestionIndex: 0,
            totalQuestions,
            segmentTimes: new Array(totalQuestions).fill(0),
            answers: new Array(totalQuestions).fill(''),
            correctAnswers: 0,
            currentAnswer: '',
            isCompleted: false,
          }
        })
      },

      // 解答を更新
      updateAnswer: (answer) => {
        const session = get().currentSession
        if (!session) return

        set({
          currentSession: {
            ...session,
            currentAnswer: answer,
          }
        })
      },

      // 解答を送信
      submitAnswer: (answer, isCorrect) => {
        const session = get().currentSession
        if (!session) return

        const newAnswers = [...session.answers]
        newAnswers[session.currentQuestionIndex] = answer

        set({
          currentSession: {
            ...session,
            answers: newAnswers,
            correctAnswers: session.correctAnswers + (isCorrect ? 1 : 0),
            currentAnswer: '',
          }
        })
      },

      // 次の問題に進む
      nextQuestion: () => {
        const session = get().currentSession
        if (!session) return

        const nextIndex = session.currentQuestionIndex + 1
        const isCompleted = nextIndex >= session.totalQuestions

        set({
          currentSession: {
            ...session,
            currentQuestionIndex: nextIndex,
            isCompleted,
          }
        })
      },

      // セッションを完了
      completeSession: () => {
        const session = get().currentSession
        if (!session) return

        set({
          currentSession: {
            ...session,
            isCompleted: true,
          }
        })
      },

      // セッションをクリア
      clearSession: () => {
        set({ currentSession: null })
      },

      // セグメントタイムを記録
      recordSegmentTime: (questionIndex, timeMs) => {
        const session = get().currentSession
        if (!session) return

        const newSegmentTimes = [...session.segmentTimes]
        newSegmentTimes[questionIndex] = timeMs

        set({
          currentSession: {
            ...session,
            segmentTimes: newSegmentTimes,
          }
        })
      },
    }),
    {
      name: 'puzzle-store',
    }
  )
)