'use client'

import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface VentEntry {
  id: string
  timestamp: number
  content: string
  intensity: number
}

export default function Home() {
  const [content, setContent] = useState('')
  const [intensity, setIntensity] = useState(3)
  const [vents, setVents] = useState<VentEntry[]>([])
  const [isExploding, setIsExploding] = useState(false)
  const [isShaking, setIsShaking] = useState(false)
  const [isFlashing, setIsFlashing] = useState(false)
  const [filterIntensity, setFilterIntensity] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [showEncouragement, setShowEncouragement] = useState(false)
  const [encouragementText, setEncouragementText] = useState('')

  // Load vents from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vents')
    if (saved) {
      setVents(JSON.parse(saved))
    }

    // Show keyboard hint after 5 seconds
    const timer = setTimeout(() => setShowHint(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Calculate venting streak
  const getVentingStreak = () => {
    if (vents.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const ventDates = vents
      .map(v => new Date(v.timestamp))
      .map(d => {
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
      .filter((date, i, arr) => arr.indexOf(date) === i)
      .sort((a, b) => b - a)

    let streak = 0
    let currentDate = today.getTime()

    for (const date of ventDates) {
      const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24))
      if (diffDays === streak) {
        streak++
        currentDate = date
      } else {
        break
      }
    }

    return streak
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to submit
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (content.trim() && !isExploding) {
          handleVent()
        }
      }
      // Escape to clear input
      if (e.key === 'Escape') {
        setContent('')
      }
      // Number keys 1-5 to set intensity
      if (e.key >= '1' && e.key <= '5' && document.activeElement?.tagName !== 'TEXTAREA') {
        setIntensity(Number(e.key))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [content, isExploding, intensity])

  // Save vents to localStorage
  const saveVents = (newVents: VentEntry[]) => {
    setVents(newVents)
    localStorage.setItem('vents', JSON.stringify(newVents))
  }

  // Trigger explosion effect
  const triggerExplosion = async () => {
    setIsExploding(true)
    setIsShaking(true)
    setIsFlashing(true)

    // Remove shake after animation
    setTimeout(() => setIsShaking(false), 500)
    setTimeout(() => setIsFlashing(false), 300)

    // Intensity affects particle count and spread
    const particleCount = intensity * 50
    const spread = intensity * 50

    await confetti({
      particleCount,
      spread,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#ff4400', '#ff8800', '#ffcc00', '#ffffff'],
      disableForReducedMotion: true,
      gravity: intensity * 0.2,
      drift: intensity * 0.5,
      scalar: intensity * 0.5,
    })

    // Second wave
    setTimeout(() => {
      confetti({
        particleCount: particleCount / 2,
        spread: spread * 1.5,
        origin: { y: 0.7 },
        colors: ['#ff0000', '#ff4400', '#ff8800'],
        angle: 60,
        disableForReducedMotion: true,
      })
    }, 200)

    // Third wave
    setTimeout(() => {
      confetti({
        particleCount: particleCount / 2,
        spread: spread * 1.5,
        origin: { y: 0.7 },
        colors: ['#ff0000', '#ff4400', '#ff8800'],
        angle: 120,
        disableForReducedMotion: true,
      })
      setIsExploding(false)
    }, 400)
  }

  // Handle vent submit
  const handleVent = () => {
    if (!content.trim()) return

    // Trigger explosion
    triggerExplosion()

    // Show encouragement
    const encouragements = [
      '发泄完了，感觉好点了吗？💪',
      '深呼吸，明天又是新的一天！🌟',
      '你已经很棒了，休息一下吧 😌',
      '情绪释放出来，心情会更好！✨',
      '这种时候，吃点好的犒劳自己 🍜',
      '抱抱你，一切都会好起来的 🤗',
      '今晚早点睡，什么都别想 😴',
      '你值得更好的！加油！💪',
      '发泄完，该干嘛干嘛，别内耗！🚀',
      '记住，工作只是生活的一部分 🌈',
    ]
    setEncouragementText(encouragements[Math.floor(Math.random() * encouragements.length)])
    setShowEncouragement(true)
    setTimeout(() => setShowEncouragement(false), 3000)

    // Save vent
    const newVent: VentEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      content: content.trim(),
      intensity,
    }
    saveVents([newVent, ...vents])

    // Clear input
    setContent('')
  }

  // Delete vent
  const deleteVent = (id: string) => {
    saveVents(vents.filter(v => v.id !== id))
  }

  // Clear all vents
  const clearAllVents = () => {
    if (confirm('确定要清空所有发泄记录吗？此操作不可恢复。')) {
      saveVents([])
    }
  }

  // Quick vent with preset content
  const quickVent = (presetContent: string) => {
    setContent(presetContent)
    setIntensity(Math.floor(Math.random() * 2) + 4) // Random 4-5 intensity
  }

  // Export vents to JSON
  const exportVents = () => {
    const dataStr = JSON.stringify(vents, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `发泄记录_${new Date().toLocaleDateString('zh-CN')}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Random vent generator
  const randomVentTemplates = [
    '为什么老板总是在下班前开会？！😤',
    '这个需求已经改了8次了，还在改！🤬',
    '同事又把锅甩给我了，真的受够了！😡',
    '周末还要加班，我的人生就是这样了吗？😔',
    '领导说要「拥抱变化」，其实就是变着法折磨人🙄',
    '今天又被客户无理取闹骂了一顿，心累😮‍💨',
    '项目 deadline 明天，现在才告诉我需求变了！😤',
    '同事电脑坏了找我修，我是 IT 吗？！🤬',
    '又要写周报，周报周报，周你个头啊！😡',
    '领导画的饼太大了，吃撑了🙄',
    '今天通勤3小时，到公司已经不想工作了😮‍💨',
    '为什么我什么都要做，同事在摸鱼？！😤',
    '又是没有进展的一天，感觉自己好废😔',
    '面试挂了，感觉自己什么都做不好😮‍💨',
    '看到同龄人都买房了，我还租房😔',
  ]

  const randomVent = () => {
    const random = randomVentTemplates[Math.floor(Math.random() * randomVentTemplates.length)]
    setContent(random)
    setIntensity(Math.floor(Math.random() * 3) + 3) // Random 3-5 intensity
  }

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 ${isShaking ? 'animate-shake' : ''}`}>
      {/* Flash overlay */}
      {isFlashing && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-flash bg-white" />
      )}

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Encouragement Toast */}
        {showEncouragement && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in-up">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg font-medium">
              {encouragementText}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            💥 发泄一下
          </h1>
          <p className="text-gray-300">写下你的烦恼，点击发泄，看着它爆炸！</p>

          {/* Streak Display */}
          {getVentingStreak() > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-full px-4 py-2">
              <span className="text-2xl">🔥</span>
              <span className="text-white font-bold">{getVentingStreak()} 天连续发泄</span>
            </div>
          )}
        </div>

        {/* Vent Input */}
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 mb-6 shadow-2xl border border-gray-700">
          {/* Quick vent buttons */}
          <div className="flex gap-2 mb-3 flex-wrap items-center">
            <span className="text-xs text-gray-500 mr-1">快捷:</span>
            {['今天加班到很晚😤', '领导又画饼了🙄', '需求又变了😡', '不想干了😤', '周末还要开会🤬'].map((preset) => (
              <button
                key={preset}
                onClick={() => quickVent(preset)}
                className="px-3 py-1 text-xs bg-gray-700/50 text-gray-400 hover:bg-red-500/20 hover:text-red-300 rounded-full transition-colors"
              >
                {preset}
              </button>
            ))}
            <button
              onClick={randomVent}
              className="px-3 py-1 text-xs bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-full transition-colors ml-auto"
            >
              🎲 随机发泄
            </button>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="说出你的烦恼... 老板？同事？加班？"
            className="w-full h-32 bg-gray-900/50 text-white placeholder-gray-500 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 border border-gray-600"
          />

          {/* Intensity Slider */}
          <div className="mt-4">
            <label className="text-white text-sm mb-2 block">
              情绪强度: <span className="text-red-400 font-bold">{intensity}</span>
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>轻微</span>
              <span>崩溃</span>
            </div>
          </div>

          {/* Vent Button */}
          <button
            onClick={handleVent}
            disabled={!content.trim() || isExploding}
            className={`w-full mt-4 py-4 rounded-xl font-bold text-lg transition-all relative ${
              isExploding
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 active:scale-95 shadow-lg hover:shadow-red-500/50'
            } text-white disabled:opacity-50`}
          >
            {isExploding ? '💥 爆炸中...' : '💥 发泄！'}
            {showHint && !isExploding && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-gray-900 text-gray-400 px-3 py-1 rounded-full whitespace-nowrap animate-bounce">
                Ctrl + Enter 快速发泄
              </span>
            )}
          </button>

          {/* Keyboard shortcuts hint */}
          <div className="mt-3 text-center text-xs text-gray-500">
            <span className="mr-3">Esc 清空输入</span>
            <span>数字键 1-5 设置强度</span>
          </div>
        </div>

        {/* Vent History */}
        <div className="space-y-4">
          {/* Statistics Panel */}
          {vents.length > 0 && (
            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">📊 情绪统计</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-400">{vents.length}</div>
                  <div className="text-xs text-gray-400">总发泄次数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">
                    {vents.length > 0 ? (vents.reduce((sum, v) => sum + v.intensity, 0) / vents.length).toFixed(1) : 0}
                  </div>
                  <div className="text-xs text-gray-400">平均强度</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">
                    {vents.filter(v => v.intensity >= 4).length}
                  </div>
                  <div className="text-xs text-gray-400">高强度次数</div>
                </div>
              </div>

              {/* Intensity distribution */}
              <div className="mt-4">
                <div className="text-xs text-gray-400 mb-2">强度分布</div>
                <div className="flex gap-1 h-8">
                  {[1, 2, 3, 4, 5].map((level) => {
                    const count = vents.filter(v => v.intensity === level).length
                    const percentage = vents.length > 0 ? (count / vents.length) * 100 : 0
                    return (
                      <div
                        key={level}
                        className="flex-1 bg-gray-700 rounded flex items-end justify-center relative group"
                        title={`强度${level}: ${count}次`}
                      >
                        <div
                          className="w-full bg-red-500/80 rounded-t transition-all"
                          style={{ height: `${Math.max(percentage, 5)}%` }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                          {count}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              📝 发泄记录 ({vents.length})
            </h2>
            <div className="flex gap-2">
              {vents.length > 0 && (
                <>
                  <button
                    onClick={exportVents}
                    className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-400 hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                  >
                    导出
                  </button>
                  <button
                    onClick={clearAllVents}
                    className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                  >
                    清空全部
                  </button>
                </>
              )}
              <button
                onClick={() => setFilterIntensity(null)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  filterIntensity === null
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                全部
              </button>
            </div>
          </div>

          {/* Intensity filter */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => setFilterIntensity(filterIntensity === level ? null : level)}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                  filterIntensity === level
                    ? 'bg-red-500 text-white scale-105'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {'🔥'.repeat(level)}
              </button>
            ))}
          </div>

          {vents.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              还没有发泄记录，快来发泄一下吧！
            </div>
          ) : (
            <>
              {vents.filter((vent) => filterIntensity === null || vent.intensity === filterIntensity).length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  {filterIntensity !== null ? '没有符合该强度的发泄记录' : '还没有发泄记录，快来发泄一下吧！'}
                </div>
              ) : (
                vents
                  .filter((vent) => filterIntensity === null || vent.intensity === filterIntensity)
                  .map((vent) => (
                    <div
                      key={vent.id}
                      className="bg-gray-800/30 backdrop-blur rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(vent.timestamp)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            强度: {'🔥'.repeat(vent.intensity)}
                          </span>
                          <button
                            onClick={() => deleteVent(vent.id)}
                            className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <p className="text-white whitespace-pre-wrap">{vent.content}</p>
                    </div>
                  ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
