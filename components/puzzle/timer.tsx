'use client'

import { useEffect, useState } from 'react'
import { Clock, Pause, Play } from 'lucide-react'

interface TimerProps {
  startTime: number
  isActive: boolean
  onTimeUpdate?: (elapsedTime: number) => void
  className?: string
}

export function Timer({ startTime, isActive, onTimeUpdate, className = '' }: TimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [pausedTime, setPausedTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        const now = Date.now()
        const elapsed = now - startTime - pausedTime
        setElapsedTime(elapsed)
        
        if (onTimeUpdate) {
          onTimeUpdate(elapsed)
        }
      }, 100) // 100ms間隔で更新
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isPaused, startTime, pausedTime, onTimeUpdate])

  const togglePause = () => {
    if (isPaused) {
      // 再開時：一時停止していた時間を記録
      setPausedTime(prev => prev + (Date.now() - pausedTime))
      setIsPaused(false)
    } else {
      // 一時停止時：現在時刻を記録
      setPausedTime(Date.now())
      setIsPaused(true)
    }
  }

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    const ms = Math.floor((milliseconds % 1000) / 10)
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const getTimeColor = (): string => {
    const minutes = Math.floor(elapsedTime / 60000)
    if (minutes < 5) return 'text-green-600'
    if (minutes < 10) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-600" />
        <div className="font-mono text-lg font-bold">
          <span className={getTimeColor()}>
            {formatTime(elapsedTime)}
          </span>
        </div>
      </div>
      
      {isActive && (
        <button
          onClick={togglePause}
          className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          title={isPaused ? "再開" : "一時停止"}
        >
          {isPaused ? (
            <Play className="w-4 h-4 text-gray-600" />
          ) : (
            <Pause className="w-4 h-4 text-gray-600" />
          )}
        </button>
      )}
      
      {isPaused && (
        <div className="text-sm text-yellow-600 font-medium">
          一時停止中
        </div>
      )}
    </div>
  )
}