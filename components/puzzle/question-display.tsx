'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Eye, EyeOff, HelpCircle, ZoomIn, ZoomOut } from 'lucide-react'

interface Question {
  id: string
  order: number
  imageUrl: string
  answerFormat: string[]
}

interface QuestionDisplayProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  showHint?: boolean
  onToggleHint?: () => void
  className?: string
}

export function QuestionDisplay({ 
  question, 
  questionNumber, 
  totalQuestions, 
  showHint = false, 
  onToggleHint,
  className = '' 
}: QuestionDisplayProps) {
  const [imageError, setImageError] = useState(false)
  const [imageZoom, setImageZoom] = useState(1)
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleImageError = () => {
    setImageError(true)
  }

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5))
  }

  const handleResetZoom = () => {
    setImageZoom(1)
    setImagePosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (imageZoom > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && imageZoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const generateHintText = (format: string[]): string => {
    const hints: { [key: string]: string } = {
      '数字': '答えは数字で入力してください',
      'ひらがな': '答えはひらがなで入力してください',
      'カタカナ': '答えはカタカナで入力してください',
      '英語': '答えは英語で入力してください',
      '漢字': '答えは漢字で入力してください',
      '文字列': '答えは文字列で入力してください'
    }
    
    return format.map(f => hints[f] || `答えは${f}で入力してください`).join('、')
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      {/* 問題ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            問題 {questionNumber}
          </div>
          <div className="text-sm text-gray-600">
            {questionNumber} / {totalQuestions}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* ヒント表示切り替え */}
          {onToggleHint && (
            <button
              onClick={onToggleHint}
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors ${
                showHint 
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showHint ? 'ヒント非表示' : 'ヒント表示'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 問題画像 */}
      <div className="relative mb-4">
        <div className="relative h-64 md:h-80 bg-gray-100 rounded-lg overflow-hidden">
          {!imageError && question.imageUrl ? (
            <div 
              className="relative w-full h-full cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Image
                src={question.imageUrl}
                alt={`問題${questionNumber}`}
                fill
                className="object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                  cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
                onError={handleImageError}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="text-6xl mb-4">🧩</div>
                <div className="text-gray-500 text-lg">問題画像を読み込み中...</div>
              </div>
            </div>
          )}
        </div>
        
        {/* 画像コントロール */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            title="縮小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full hover:bg-opacity-70 transition-opacity text-sm"
            title="リセット"
          >
            {Math.round(imageZoom * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            title="拡大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 解答形式表示 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">解答形式:</span>
          <div className="flex gap-2">
            {question.answerFormat.map((format, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ヒント表示 */}
      {showHint && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-1">ヒント</h4>
              <p className="text-sm text-yellow-700">
                {generateHintText(question.answerFormat)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 追加情報 */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 画像をクリックして拡大・縮小できます。詳しく観察してみてください！
        </p>
      </div>
    </div>
  )
}