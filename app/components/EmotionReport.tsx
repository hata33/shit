'use client'

import { useMemo } from 'react'

interface VentEntry {
  id: string
  timestamp: number
  content: string
  intensity: number
  tags?: string[]
}

interface EmotionReportProps {
  vents: VentEntry[]
}

export function EmotionReport({ vents }: EmotionReportProps) {
  // 计算情绪报告数据
  const reportData = useMemo(() => {
    if (vents.length === 0) return null

    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // 按天统计
    const dailyStats = new Map<string, { count: number; totalIntensity: number }>()
    vents.forEach((vent) => {
      const date = new Date(vent.timestamp)
      const key = `${date.getMonth() + 1}/${date.getDate()}`
      if (!dailyStats.has(key)) {
        dailyStats.set(key, { count: 0, totalIntensity: 0 })
      }
      const stat = dailyStats.get(key)!
      stat.count++
      stat.totalIntensity += vent.intensity
    })

    // 趋势数据（最近7天）
    const trendData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      const key = `${date.getMonth() + 1}/${date.getDate()}`
      const stat = dailyStats.get(key)
      return {
        date: key,
        count: stat?.count || 0,
        avgIntensity: stat ? Math.round((stat.totalIntensity / stat.count) * 10) / 10 : 0,
      }
    })

    // 时间分布（按小时）
    const hourlyDistribution = Array.from({ length: 24 }, (_, i) => {
      const count = vents.filter((vent) => {
        const hour = new Date(vent.timestamp).getHours()
        return hour === i
      }).length
      return count
    })

    // 标签统计
    const tagCounts = new Map<string, number>()
    vents.forEach((vent) => {
      vent.tags?.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    })
    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    // 强度分布
    const intensityDistribution = [1, 2, 3, 4, 5].map((level) =>
      vents.filter((v) => v.intensity === level).length
    )

    // 本周 vs 上周对比
    const thisWeekVents = vents.filter((v) => new Date(v.timestamp) >= oneWeekAgo)
    const lastWeekVents = vents.filter((v) => {
      const date = new Date(v.timestamp)
      return date >= new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000) && date < oneWeekAgo
    })

    // 提取关键词
    const keywords = new Map<string, number>()
    vents.forEach((vent) => {
      const words = vent.content.split(/[\s\n\r,.!?;:，。！？；：、]+/)
      words.forEach((word) => {
        if (word.length >= 2) {
          keywords.set(word, (keywords.get(word) || 0) + 1)
        }
      })
    })
    const topKeywords = Array.from(keywords.entries())
      .filter(([word]) => !/[，。！？；：、\s\n\r]/.test(word))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)

    // 总体统计
    const totalVents = vents.length
    const avgIntensity = vents.reduce((sum, v) => sum + v.intensity, 0) / vents.length
    const highIntensityCount = vents.filter((v) => v.intensity >= 4).length
    const mostActiveHour = hourlyDistribution.indexOf(Math.max(...hourlyDistribution))

    // 情绪洞察
    let insights: string[] = []
    if (avgIntensity >= 4) {
      insights.push('你的整体情绪强度较高，说明最近压力较大')
    } else if (avgIntensity <= 2) {
      insights.push('你的整体情绪较平和，状态不错')
    }

    if (thisWeekVents.length > lastWeekVents.length * 1.5) {
      insights.push('本周发泄次数明显增加，可能遇到了较多压力事件')
    } else if (thisWeekVents.length < lastWeekVents.length * 0.5) {
      insights.push('本周发泄次数减少，情绪可能有所好转')
    }

    if (highIntensityCount / totalVents > 0.5) {
      insights.push('高强度发泄占比较高，建议适当放松')
    }

    if (mostActiveHour >= 22 || mostActiveHour <= 6) {
      insights.push('你经常在深夜或凌晨发泄，注意休息')
    }

    if (insights.length === 0) {
      insights.push('保持发泄的习惯有助于情绪管理')
    }

    return {
      totalVents,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      highIntensityCount,
      mostActiveHour,
      thisWeekCount: thisWeekVents.length,
      lastWeekCount: lastWeekVents.length,
      trendData,
      hourlyDistribution,
      topTags,
      intensityDistribution,
      topKeywords,
      insights,
    }
  }, [vents])

  if (!reportData) {
    return (
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700 text-center">
        <p className="text-gray-400">还没有发泄记录，无法生成报告</p>
      </div>
    )
  }

  const {
    totalVents,
    avgIntensity,
    highIntensityCount,
    mostActiveHour,
    thisWeekCount,
    lastWeekCount,
    trendData,
    hourlyDistribution,
    topTags,
    intensityDistribution,
    topKeywords,
    insights,
  } = reportData

  const getIntensityColor = (level: number) => {
    if (level <= 2) return 'bg-green-500'
    if (level <= 3) return 'bg-yellow-500'
    if (level <= 4) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getHourLabel = (hour: number) => {
    if (hour === 0) return '12AM'
    if (hour < 12) return `${hour}AM`
    if (hour === 12) return '12PM'
    return `${hour - 12}PM`
  }

  return (
    <div className="space-y-6">
      {/* 报告标题 */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">📊 情绪报告</h2>
        <div className="text-sm text-gray-400">基于 {totalVents} 条发泄记录</div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-white">{totalVents}</div>
          <div className="text-xs text-gray-400 mt-1">总发泄次数</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-orange-400">{avgIntensity}</div>
          <div className="text-xs text-gray-400 mt-1">平均强度</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-red-400">{highIntensityCount}</div>
          <div className="text-xs text-gray-400 mt-1">高强度次数</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="text-3xl font-bold text-blue-400">{getHourLabel(mostActiveHour)}</div>
          <div className="text-xs text-gray-400 mt-1">最活跃时段</div>
        </div>
      </div>

      {/* 本周 vs 上周 */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">📈 本周 vs 上周</h3>
        <div className="flex items-center justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{thisWeekCount}</div>
            <div className="text-xs text-gray-400 mt-1">本周</div>
          </div>
          <div className={`text-2xl font-bold ${thisWeekCount > lastWeekCount ? 'text-green-400' : thisWeekCount < lastWeekCount ? 'text-red-400' : 'text-gray-400'}`}>
            {thisWeekCount > lastWeekCount ? '↑' : thisWeekCount < lastWeekCount ? '↓' : '→'}
            {lastWeekCount > 0 ? ((thisWeekCount - lastWeekCount) / lastWeekCount * 100).toFixed(0) : 0}%
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{lastWeekCount}</div>
            <div className="text-xs text-gray-400 mt-1">上周</div>
          </div>
        </div>
      </div>

      {/* 情绪趋势 */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">📉 7天情绪趋势</h3>
        <div className="flex items-end justify-between h-40 gap-2">
          {trendData.map((day, i) => {
            const maxCount = Math.max(...trendData.map((d) => d.count))
            const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  {day.count > 0 && (
                    <div className="text-xs text-gray-400 mb-1">
                      {day.avgIntensity > 0 ? `🔥${day.avgIntensity}` : ''}
                    </div>
                  )}
                  <div
                    className="w-full rounded-t-lg transition-all"
                    style={{
                      height: `${Math.max(height, 4)}%`,
                      backgroundColor: day.avgIntensity >= 4 ? '#ef4444' : day.avgIntensity >= 3 ? '#f97316' : day.avgIntensity >= 2 ? '#eab308' : '#22c55e',
                    }}
                  />
                </div>
                <div className="text-xs text-gray-400">{day.date}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 时间分布 */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">🕐 发泄时间分布</h3>
        <div className="flex items-end justify-between h-24 gap-1">
          {hourlyDistribution.map((count, i) => {
            const maxCount = Math.max(...hourlyDistribution)
            const height = maxCount > 0 ? (count / maxCount) * 100 : 0
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500/80 rounded-t"
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                <div className="text-xs text-gray-500 mt-1">{i}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 强度分布 */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">📊 强度分布</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((level) => (
            <div key={level} className="flex items-center gap-3">
              <div className="w-20 text-sm text-gray-400">{'🔥'.repeat(level)}</div>
              <div className="flex-1 h-6 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getIntensityColor(level)} transition-all`}
                  style={{ width: `${totalVents > 0 ? (intensityDistribution[level - 1] / totalVents) * 100 : 0}%` }}
                />
              </div>
              <div className="w-12 text-sm text-white text-right">{intensityDistribution[level - 1]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 热门标签 */}
      {topTags.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">🏷️ 热门标签</h3>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <div key={tag} className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-3 py-2">
                <span className="text-white text-sm">{tag}</span>
                <span className="text-xs text-gray-400">{count}次</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 关键词云 */}
      {topKeywords.length > 0 && (
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">☁️ 关键词云</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {topKeywords.map(([word, count]) => {
              const fontSize = Math.max(12, Math.min(24, 12 + count * 2))
              const opacity = Math.min(1, 0.5 + count * 0.1)
              return (
                <span
                  key={word}
                  className="text-gray-300"
                  style={{ fontSize: `${fontSize}px`, opacity }}
                >
                  {word}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* 情绪洞察 */}
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4 border border-blue-500/30">
        <h3 className="text-lg font-bold text-white mb-4">💡 情绪洞察</h3>
        <ul className="space-y-2">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-300">
              <span className="text-blue-400 mt-1">•</span>
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
