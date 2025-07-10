import { PuzzleSession } from '@/types/store'

// セッション管理のユーティリティ関数

// 経過時間を計算（ミリ秒）
export function calculateElapsedTime(startTime: string): number {
  const start = new Date(startTime)
  const now = new Date()
  return now.getTime() - start.getTime()
}

// セグメント時間を計算
export function calculateSegmentTime(
  session: PuzzleSession,
  questionIndex: number
): number {
  if (!session.segmentTimes[questionIndex]) {
    return 0
  }
  return session.segmentTimes[questionIndex]
}

// 合計時間を計算
export function calculateTotalTime(session: PuzzleSession): number {
  if (session.isCompleted && session.totalTime > 0) {
    return session.totalTime
  }
  
  return calculateElapsedTime(session.startedAt)
}

// 進捗率を計算
export function calculateProgress(session: PuzzleSession): number {
  if (session.totalQuestions === 0) return 0
  return (session.currentQuestionIndex / session.totalQuestions) * 100
}

// 時間を人間が読める形式でフォーマット
export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const ms = Math.floor((milliseconds % 1000) / 10) // 10ms単位

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  } else {
    return `${seconds}.${ms.toString().padStart(2, '0')}`
  }
}

// 時間を短縮形式でフォーマット（例：1分30秒）
export function formatTimeShort(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes > 0) {
    return `${minutes}分${seconds}秒`
  } else {
    return `${seconds}秒`
  }
}

// セッションの状態を検証
export function validateSession(session: PuzzleSession): boolean {
  if (!session.id || !session.puzzleId) {
    return false
  }
  
  if (session.currentQuestionIndex < 0 || session.currentQuestionIndex > session.totalQuestions) {
    return false
  }
  
  if (session.segmentTimes.length !== session.totalQuestions) {
    return false
  }
  
  if (session.answers.length !== session.totalQuestions) {
    return false
  }
  
  return true
}

// セッションのディープコピー
export function cloneSession(session: PuzzleSession): PuzzleSession {
  return {
    ...session,
    segmentTimes: [...session.segmentTimes],
    answers: [...session.answers],
  }
}

// 次の問題があるかチェック
export function hasNextQuestion(session: PuzzleSession): boolean {
  return session.currentQuestionIndex < session.totalQuestions - 1
}

// 前の問題があるかチェック
export function hasPreviousQuestion(session: PuzzleSession): boolean {
  return session.currentQuestionIndex > 0
}

// 現在の問題番号を取得（1から始まる）
export function getCurrentQuestionNumber(session: PuzzleSession): number {
  return session.currentQuestionIndex + 1
}