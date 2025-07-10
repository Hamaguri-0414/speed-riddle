'use client'

import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  className?: string
}

export function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  color = 'gray',
  className 
}: StatsCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
  }

  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex items-center gap-2 text-gray-600">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <span className={`font-semibold ${colorClasses[color]}`}>
        {value}
      </span>
    </div>
  )
}

interface StatsGridProps {
  children: ReactNode
  className?: string
}

export function StatsGrid({ children, className }: StatsGridProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {children}
    </div>
  )
}