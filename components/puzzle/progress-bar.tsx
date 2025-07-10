'use client'

import { CheckCircle2, Circle, PlayCircle } from 'lucide-react'

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = (current / total) * 100
  
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">進捗状況</h3>
        <span className="text-sm text-gray-600">
          {current} / {total} 問
        </span>
      </div>
      
      {/* プログレスバー */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* パーセンテージ表示 */}
        <div className="absolute -top-6 left-0 text-xs text-gray-600">
          {Math.round(percentage)}%
        </div>
      </div>
      
      {/* 問題別進捗アイコン */}
      <div className="flex items-center justify-between mt-4">
        {Array.from({ length: total }, (_, index) => {
          const questionNumber = index + 1
          const isCompleted = questionNumber < current
          const isCurrent = questionNumber === current
          const isUpcoming = questionNumber > current
          
          return (
            <div
              key={questionNumber}
              className="flex flex-col items-center gap-1"
            >
              {/* アイコン */}
              <div className={`transition-colors ${
                isCompleted 
                  ? 'text-green-600' 
                  : isCurrent 
                    ? 'text-blue-600' 
                    : 'text-gray-300'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : isCurrent ? (
                  <PlayCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              
              {/* 問題番号 */}
              <span className={`text-xs font-medium ${
                isCompleted 
                  ? 'text-green-600' 
                  : isCurrent 
                    ? 'text-blue-600' 
                    : 'text-gray-400'
              }`}>
                {questionNumber}
              </span>
            </div>
          )
        })}
      </div>
      
      {/* 完了メッセージ */}
      {current === total && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">
              すべての問題が完了しました！
            </span>
          </div>
        </div>
      )}
    </div>
  )
}