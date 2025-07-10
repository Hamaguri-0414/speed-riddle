'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">
            エラーが発生しました
          </h3>
        </div>
        
        <p className="text-red-700 mb-4">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors w-full justify-center"
          >
            <RefreshCw className="w-4 h-4" />
            再試行
          </button>
        )}
      </div>
    </div>
  )
}