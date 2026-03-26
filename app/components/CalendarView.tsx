'use client'

import { useState, useMemo } from 'react'

interface VentEntry {
  id: string
  timestamp: number
  content: string
  intensity: number
}

interface CalendarViewProps {
  vents: VentEntry[]
  onSelectDate: (date: Date) => void
  selectedDate: Date | null
}

export function CalendarView({ vents, onSelectDate, selectedDate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get vents by date
  const ventsByDate = useMemo(() => {
    const map = new Map<string, VentEntry[]>()
    vents.forEach((vent) => {
      const date = new Date(vent.timestamp)
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
      if (!map.has(key)) {
        map.set(key, [])
      }
      map.get(key)!.push(vent)
    })
    return map
  }, [vents])

  // Get calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startDayOfWeek = firstDay.getDay()
    const daysInMonth = lastDay.getDate()

    const days: Date[] = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(new Date(year, month, 0 - startDayOfWeek + i + 1))
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }, [currentMonth])

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const getDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const isOtherMonth = (date: Date) => {
    return date.getMonth() !== currentMonth.getMonth()
  }

  const getDayVents = (date: Date) => {
    const key = getDateKey(date)
    return ventsByDate.get(key) || []
  }

  const getAverageIntensity = (date: Date) => {
    const dayVents = getDayVents(date)
    if (dayVents.length === 0) return 0
    return dayVents.reduce((sum, v) => sum + v.intensity, 0) / dayVents.length
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-800/50'
    if (intensity <= 2) return 'bg-green-500/30'
    if (intensity <= 3) return 'bg-yellow-500/30'
    if (intensity <= 4) return 'bg-orange-500/30'
    return 'bg-red-500/30'
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-lg font-bold text-white">
          {currentMonth.getFullYear()}年 {currentMonth.getMonth() + 1}月
        </h3>

        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dayVents = getDayVents(date)
          const avgIntensity = getAverageIntensity(date)
          const otherMonth = isOtherMonth(date)

          return (
            <button
              key={index}
              onClick={() => !otherMonth && onSelectDate(date)}
              disabled={otherMonth}
              className={`
                aspect-square rounded-lg p-1 text-sm transition-all relative
                ${otherMonth ? 'text-gray-600 cursor-not-allowed' : 'text-white hover:bg-gray-700/50 cursor-pointer'}
                ${isToday(date) ? 'ring-2 ring-red-500' : ''}
                ${isSelected(date) ? 'bg-red-500/30' : ''}
                ${getIntensityColor(avgIntensity)}
              `}
            >
              <span className={otherMonth ? 'opacity-30' : ''}>{date.getDate()}</span>

              {dayVents.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {Array.from({ length: Math.min(dayVents.length, 3) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full bg-red-400"
                      style={{ opacity: 0.7 - i * 0.2 }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-500/30" />
          <span>轻松</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-500/30" />
          <span>一般</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-orange-500/30" />
          <span>烦躁</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-500/30" />
          <span>崩溃</span>
        </div>
      </div>
    </div>
  )
}
