'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ErrorMessage } from '@/components/ui/error-message'
import { Timer } from '@/components/puzzle/timer'
import { QuestionDisplay } from '@/components/puzzle/question-display'
import { AnswerInput } from '@/components/puzzle/answer-input'
import { ProgressBar } from '@/components/puzzle/progress-bar'
import { usePuzzle } from '@/hooks/use-puzzle'
import { usePuzzleStore } from '@/store/puzzle-store'
import { useAuth } from '@/hooks/use-auth'

interface Question {
  id: string
  puzzleId: string
  order: number
  imageUrl: string
  answerFormat: string[]
  answers: {
    id: string
    correctAnswer: string
    alternativeAnswers: string[]
  }[]
}

interface PuzzleWithQuestions {
  id: string
  title: string
  description: string
  totalQuestions: number
  questions: Question[]
}

export default function PuzzleSolvePage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  
  const puzzleId = params.id as string
  const { puzzle, currentSession, isLoading, error } = usePuzzle(puzzleId)
  const { 
    updateAnswer, 
    submitAnswer,
    nextQuestion, 
    completeSession,
    startSession 
  } = usePuzzleStore()
  
  const [puzzleData, setPuzzleData] = useState<PuzzleWithQuestions | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  // 認証チェック
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/puzzles/${puzzleId}`)
      return
    }
  }, [isAuthenticated, puzzleId, router])

  // 謎解き詳細データの取得
  useEffect(() => {
    const fetchPuzzleWithQuestions = async () => {
      if (!puzzleId) return
      
      try {
        const response = await fetch(`/api/puzzles/${puzzleId}`)
        if (!response.ok) {
          throw new Error('謎解きデータの取得に失敗しました')
        }
        
        const data = await response.json()
        setPuzzleData(data.puzzle)
        
        // セッションが存在しない場合は新しく開始
        if (!currentSession) {
          startSession(puzzleId, data.puzzle.totalQuestions)
        }
      } catch (error) {
        console.error('謎解きデータ取得エラー:', error)
      }
    }

    fetchPuzzleWithQuestions()
  }, [puzzleId, currentSession, startSession])

  // 現在の問題を取得
  const getCurrentQuestion = (): Question | null => {
    if (!puzzleData || !currentSession) return null
    
    const currentOrder = currentSession.currentQuestionIndex + 1
    return puzzleData.questions.find(q => q.order === currentOrder) || null
  }

  // 解答送信処理
  const handleSubmitAnswer = async (answer: string) => {
    if (!currentSession || !puzzleData) return
    
    setIsSubmitting(true)
    setFeedback({ type: null, message: '' })
    
    try {
      const currentQuestion = getCurrentQuestion()
      if (!currentQuestion) {
        throw new Error('現在の問題が見つかりません')
      }

      // 解答の正誤判定
      const correctAnswers = currentQuestion.answers[0]
      const isCorrect = 
        answer.toLowerCase().trim() === correctAnswers.correctAnswer.toLowerCase() ||
        correctAnswers.alternativeAnswers.some(alt => 
          answer.toLowerCase().trim() === alt.toLowerCase()
        )

      if (isCorrect) {
        // 正解の場合
        submitAnswer(answer, true)
        setFeedback({ 
          type: 'success', 
          message: '正解です！' 
        })

        // 短時間後に次の問題に進む
        setTimeout(() => {
          if (currentSession.currentQuestionIndex + 1 >= puzzleData.totalQuestions) {
            // 最後の問題の場合は完了
            completeSession()
            router.push(`/puzzles/${puzzleId}/result`)
          } else {
            // 次の問題に進む
            nextQuestion()
            setFeedback({ type: null, message: '' })
            setShowHint(false)
          }
        }, 1500)
      } else {
        // 不正解の場合
        submitAnswer(answer, false)
        setFeedback({ 
          type: 'error', 
          message: '不正解です。もう一度お試しください。' 
        })
      }
    } catch (error) {
      console.error('解答送信エラー:', error)
      setFeedback({ 
        type: 'error', 
        message: '解答の送信に失敗しました。もう一度お試しください。' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // 解答入力の更新
  const handleAnswerChange = (answer: string) => {
    updateAnswer(answer)
  }

  // 謎解きを終了
  const handleQuitPuzzle = () => {
    if (confirm('謎解きを終了しますか？進行状況は保存されません。')) {
      router.push(`/puzzles/${puzzleId}`)
    }
  }

  // ヒント表示切り替え
  const toggleHint = () => {
    setShowHint(!showHint)
  }

  // ローディング表示
  if (isLoading || !puzzleData || !currentSession) {
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

  // エラー表示
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

  const currentQuestion = getCurrentQuestion()
  
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ErrorMessage 
            message="問題が見つかりません"
            onRetry={() => router.push(`/puzzles/${puzzleId}`)}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-4">
        {/* ヘッダー情報 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleQuitPuzzle}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>終了</span>
            </button>
            <h1 className="text-xl font-bold text-gray-900">
              {puzzleData.title}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Timer 
              startTime={currentSession.startTime}
              isActive={!currentSession.isCompleted}
            />
          </div>
        </div>

        {/* 進捗バー */}
        <ProgressBar 
          current={currentSession.currentQuestionIndex + 1}
          total={puzzleData.totalQuestions}
          className="mb-6"
        />

        {/* メインコンテンツ */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 問題表示 */}
          <div className="lg:col-span-1">
            <QuestionDisplay 
              question={currentQuestion}
              questionNumber={currentSession.currentQuestionIndex + 1}
              totalQuestions={puzzleData.totalQuestions}
              showHint={showHint}
              onToggleHint={toggleHint}
            />
          </div>

          {/* 解答入力 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                解答入力
              </h2>
              
              {/* フィードバック表示 */}
              {feedback.type && (
                <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                  feedback.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              <AnswerInput 
                answerFormat={currentQuestion.answerFormat}
                currentAnswer={currentSession.currentAnswer || ''}
                onAnswerChange={handleAnswerChange}
                onSubmitAnswer={handleSubmitAnswer}
                isSubmitting={isSubmitting}
                disabled={feedback.type === 'success'}
              />

              {/* 統計情報 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">問題数: </span>
                    <span className="font-medium">
                      {currentSession.currentQuestionIndex + 1} / {puzzleData.totalQuestions}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">正解数: </span>
                    <span className="font-medium text-green-600">
                      {currentSession.correctAnswers}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}