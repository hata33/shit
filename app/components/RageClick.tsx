'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface RageClickProps {
  onRageComplete: (angerValue: number, clickCount: number) => void
}

export function RageClick({ onRageComplete }: RageClickProps) {
  const [isRaging, setIsRaging] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [angerValue, setAngerValue] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [clicks, setClicks] = useState<number[]>([])
  const [showParticles, setShowParticles] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const RAGE_DURATION = 5000 // 5秒
  const CLICK_WINDOW = 1000 // 计算频率的时间窗口（1秒）

  const startRage = () => {
    setIsRaging(true)
    setClickCount(0)
    setAngerValue(0)
    setClicks([])
    setTimeLeft(RAGE_DURATION)
  }

  const handleClick = useCallback(() => {
    if (!isRaging) return

    const now = Date.now()
    setClickCount((prev) => prev + 1)
    setClicks((prev) => [...prev, now])

    // Show particle effect
    setShowParticles(true)
    setTimeout(() => setShowParticles(false), 200)

    // Calculate rage frequency (clicks per second)
    const recentClicks = clicks.filter((c) => now - c < CLICK_WINDOW)
    const frequency = recentClicks.length + 1 // +1 for current click

    // Calculate anger value based on frequency
    // Base: 1 click/sec = 10 anger, max: 10 clicks/sec = 100 anger
    const newAngerValue = Math.min(Math.floor(frequency * 10), 100)
    setAngerValue(newAngerValue)
  }, [isRaging, clicks])

  // Timer
  useEffect(() => {
    if (!isRaging) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 100) {
          clearInterval(timer)
          return 0
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(timer)
  }, [isRaging])

  // Update anger value in real-time based on recent clicks
  useEffect(() => {
    if (!isRaging) return

    const updateAnger = setInterval(() => {
      const now = Date.now()
      const recentClicks = clicks.filter((c) => now - c < CLICK_WINDOW)
      const frequency = recentClicks.length
      const newAngerValue = Math.min(Math.floor(frequency * 10), 100)
      setAngerValue(newAngerValue)
    }, 100)

    return () => clearInterval(updateAnger)
  }, [isRaging, clicks])

  // End rage session
  useEffect(() => {
    if (isRaging && timeLeft === 0 && clickCount > 0) {
      // Calculate final stats
      const duration = RAGE_DURATION / 1000 // seconds
      const avgFrequency = clickCount / duration
      const finalAngerValue = Math.min(Math.floor(avgFrequency * 10), 100)

      setTimeout(() => {
        onRageComplete(finalAngerValue, clickCount)
        setIsRaging(false)
      }, 500)
    }
  }, [isRaging, timeLeft, clickCount, onRageComplete])

  const getAngerLevel = (value: number) => {
    if (value < 20) return { text: '有点烦', color: 'text-green-400', bg: 'bg-green-500/20' }
    if (value < 40) return { text: '有点生气', color: 'text-yellow-400', bg: 'bg-yellow-500/20' }
    if (value < 60) return { text: '很生气', color: 'text-orange-400', bg: 'bg-orange-500/20' }
    if (value < 80) return { text: '非常愤怒', color: 'text-red-400', bg: 'bg-red-500/20' }
    return { text: '气炸了！！！', color: 'text-red-600', bg: 'bg-red-600/20' }
  }

  const getButtonSize = () => {
    if (!isRaging) return 'w-full h-32'
    const baseSize = 32
    const sizeIncrease = Math.min(angerValue / 2, 32)
    return `w-full h-[${baseSize + sizeIncrease}rem]`
  }

  const angerLevel = getAngerLevel(angerValue)

  // Particle effects
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i / 8) * 360,
  }))

  if (!isRaging) {
    return (
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">🤬 狂点发泄</h3>
        <p className="text-gray-400 text-sm mb-4">
          疯狂点击按钮，释放你的愤怒！点击越快，愤怒值越高！
        </p>
        <button
          onClick={startRage}
          className="w-full py-8 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white rounded-xl font-bold text-xl transition-all active:scale-95 shadow-lg hover:shadow-red-500/50"
        >
          🔥 开始狂点！
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">🤬 狂点发泄中...</h3>
        <div className="text-sm text-gray-400">
          剩余时间: {(timeLeft / 1000).toFixed(1)}s
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{clickCount}</div>
          <div className="text-xs text-gray-400">点击次数</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${angerLevel.color}`}>{angerValue}</div>
          <div className="text-xs text-gray-400">愤怒值</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {clicks.length > 0
              ? ((clicks.filter((c) => Date.now() - c < 1000).length) / 1).toFixed(1)
              : '0.0'}
          </div>
          <div className="text-xs text-gray-400">点击/秒</div>
        </div>
      </div>

      {/* Anger meter */}
      <div className="mb-4">
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${angerLevel.bg.replace('/20', '')}`}
            style={{ width: `${angerValue}%` }}
          />
        </div>
        <div className={`text-center mt-2 font-bold ${angerLevel.color}`}>
          {angerLevel.text}
        </div>
      </div>

      {/* Click button */}
      <div className="relative" ref={containerRef}>
        <button
          onClick={handleClick}
          className={`
            w-full rounded-xl font-bold text-xl transition-all
            bg-gradient-to-br from-red-600 to-orange-500
            hover:from-red-700 hover:to-orange-600
            active:scale-95 shadow-lg hover:shadow-red-500/50
            ${angerValue >= 80 ? 'animate-pulse' : ''}
          `}
          style={{
            height: `${Math.max(120, 120 + angerValue * 1.5)}px`,
            fontSize: `${Math.max(20, 20 + angerValue * 0.3)}px`,
          }}
        >
          {angerValue >= 80 ? '💥💥💥 狂点！！' : angerValue >= 50 ? '😤 狂点！' : '👆 点我'}
        </button>

        {/* Particle effects */}
        {showParticles &&
          particles.map((p) => (
            <div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${p.angle}deg)`,
              }}
            >
              <div
                className="w-3 h-3 rounded-full bg-red-500"
                style={{
                  animation: 'particle-fly 0.3s ease-out forwards',
                  '--angle': `${p.angle}deg`,
                } as React.CSSProperties}
              />
            </div>
          ))}
      </div>

      <style>{`
        @keyframes particle-fly {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx, 50px), var(--ty, -50px)) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
