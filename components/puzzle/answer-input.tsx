'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, RotateCcw } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface AnswerInputProps {
  answerFormat: string[]
  currentAnswer: string
  onAnswerChange: (answer: string) => void
  onSubmitAnswer: (answer: string) => void
  isSubmitting: boolean
  disabled?: boolean
  className?: string
}

export function AnswerInput({
  answerFormat,
  currentAnswer,
  onAnswerChange,
  onSubmitAnswer,
  isSubmitting,
  disabled = false,
  className = ''
}: AnswerInputProps) {
  const [localAnswer, setLocalAnswer] = useState(currentAnswer)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalAnswer(currentAnswer)
  }, [currentAnswer])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocalAnswer(value)
    onAnswerChange(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (localAnswer.trim() && !isSubmitting && !disabled) {
      onSubmitAnswer(localAnswer.trim())
    }
  }

  const handleClear = () => {
    setLocalAnswer('')
    onAnswerChange('')
    inputRef.current?.focus()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e)
    }
  }

  const getInputPlaceholder = (): string => {
    const formatHints: { [key: string]: string } = {
      '数字': '例: 42',
      'ひらがな': '例: なぞとき',
      'カタカナ': '例: ナゾトキ',
      '英語': '例: puzzle',
      '漢字': '例: 謎解',
      '文字列': '例: 答えを入力'
    }
    
    if (answerFormat.length === 1) {
      return formatHints[answerFormat[0]] || '答えを入力してください'
    }
    
    return '答えを入力してください'
  }

  const getInputType = (): string => {
    if (answerFormat.length === 1 && answerFormat[0] === '数字') {
      return 'number'
    }
    return 'text'
  }

  const validateInput = (value: string): boolean => {
    if (!value.trim()) return false
    
    // 数字のみの場合の検証
    if (answerFormat.length === 1 && answerFormat[0] === '数字') {
      return /^\d+$/.test(value.trim())
    }
    
    // ひらがなのみの場合の検証
    if (answerFormat.length === 1 && answerFormat[0] === 'ひらがな') {
      return /^[ぁ-ん\s]+$/.test(value.trim())
    }
    
    // カタカナのみの場合の検証
    if (answerFormat.length === 1 && answerFormat[0] === 'カタカナ') {
      return /^[ァ-ン\s]+$/.test(value.trim())
    }
    
    // 英語のみの場合の検証
    if (answerFormat.length === 1 && answerFormat[0] === '英語') {
      return /^[a-zA-Z\s]+$/.test(value.trim())
    }
    
    return true
  }

  const isValidInput = validateInput(localAnswer)
  const canSubmit = localAnswer.trim() && isValidInput && !isSubmitting && !disabled

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 入力フィールド */}
        <div className="relative">
          <input
            ref={inputRef}
            type={getInputType()}
            value={localAnswer}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={getInputPlaceholder()}
            disabled={isSubmitting || disabled}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              disabled 
                ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed' 
                : isValidInput || !localAnswer.trim()
                  ? 'border-gray-300 focus:border-blue-500' 
                  : 'border-red-300 focus:border-red-500 bg-red-50'
            }`}
            autoComplete="off"
          />
          
          {/* クリアボタン */}
          {localAnswer && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* バリデーションメッセージ */}
        {localAnswer.trim() && !isValidInput && (
          <div className="text-sm text-red-600">
            {answerFormat[0] === '数字' && '数字のみ入力してください'}
            {answerFormat[0] === 'ひらがな' && 'ひらがなのみ入力してください'}
            {answerFormat[0] === 'カタカナ' && 'カタカナのみ入力してください'}
            {answerFormat[0] === '英語' && '英語のみ入力してください'}
          </div>
        )}

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            canSubmit
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" />
              送信中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              解答を送信
            </>
          )}
        </button>
      </form>

      {/* 入力形式のヒント */}
      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="text-sm text-gray-600">
          <strong>入力形式:</strong> {answerFormat.join('、')}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Enterキーまたは送信ボタンで解答を送信できます
        </div>
      </div>
    </div>
  )
}