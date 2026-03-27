'use client'

import { useState, useCallback } from 'react'

interface BubblePopperProps {
  onComplete: (data: any, intensity: number) => void
}

export function BubblePopper({ onComplete }: BubblePopperProps) {
  const [bubbles, setBubbles] = useState<boolean[]>(Array.from({ length: 100 }, () => true))
  const [poppedCount, setPoppedCount] = useState(0)
  const [startTime] = useState(Date.now())
  const [intensity, setIntensity] = useState(3)
  const [isComplete, setIsComplete] = useState(false)

  const popBubble = useCallback((index: number) => {
    setBubbles((prev) => {
      const newBubbles = [...prev]
      newBubbles[index] = false
      return newBubbles
    })

    setPoppedCount((prev) => {
      const newCount = prev + 1

      // Check if all bubbles are popped
      if (newCount >= 100) {
        const duration = Date.now() - startTime
        const calculatedIntensity = Math.min(5, Math.max(1, Math.ceil(duration / 10000)))
        setIntensity(calculatedIntensity)
        setIsComplete(true)

        // Trigger completion after a short delay
        setTimeout(() => {
          onComplete({
            content: `🫧 挤泡泡完成！\n挤破数量: ${newCount}\n用时: ${Math.floor(duration / 1000)}秒\n情绪强度: ${calculatedIntensity}`,
            poppedCount: newCount,
            duration,
          }, calculatedIntensity)
        }, 1000)
      }

      return newCount
    })

    // Play pop sound
    playPopSound()
  }, [startTime, onComplete])

  const playPopSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800 + Math.random() * 400
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (e) {
      // Silently fail
    }
  }

  const resetGame = () => {
    setBubbles(Array.from({ length: 100 }, () => true))
    setPoppedCount(0)
    setIsComplete(false)
  }

  const progress = (poppedCount / 100) * 100

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 sm:p-6 border border-gray-700 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-bold text-white">🫧 挤泡泡纸</h3>
        <div className="flex items-center gap-2">
          <div className="text-xs text-gray-400">
            <span className="text-white font-bold">{poppedCount}</span>/100
          </div>
          <button
            onClick={resetGame}
            className="px-2 py-1 text-xs bg-gray-700 text-gray-400 rounded hover:bg-gray-600 transition-colors"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-gray-400">
            剩余: <span className="text-blue-400 font-bold">{100 - poppedCount}</span>
          </div>
          <div className="text-xs text-gray-400">
            用时: <span className="text-purple-400 font-bold">{Math.floor((Date.now() - startTime) / 1000)}s</span>
          </div>
        </div>
      </div>

      {/* Bubble grid - 10x10 */}
      <div className="mb-3">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(10, 1fr)', gap: '8px' }}>
          {bubbles.map((popped, index) => (
            <button
              key={index}
              onClick={() => popBubble(index)}
              disabled={!popped || isComplete}
              className="relative rounded-full transition-all duration-150 active:scale-90"
              style={{
                paddingBottom: '100%',
                background: popped
                  ? 'linear-gradient(135deg, #60a5fa, #2563eb)'
                  : '#374151',
                opacity: popped ? 1 : 0.3,
                transform: popped ? 'scale(1)' : 'scale(0.9)',
                boxShadow: popped
                  ? 'inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.1), 0 4px 15px rgba(59, 130, 246, 0.3)'
                  : 'none',
                cursor: popped ? 'pointer' : 'not-allowed',
              }}
              aria-label={`Bubble ${index + 1}`}
            >
              {/* Bubble highlight */}
              {popped && (
                <span
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    top: '20%',
                    left: '20%',
                    width: '25%',
                    height: '25%',
                    background: 'rgba(255, 255, 255, 0.4)',
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Complete overlay */}
      {isComplete && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="text-center p-6">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-white font-bold text-xl mb-2">太棒了！</div>
            <div className="text-sm text-gray-400 mb-4">
              你挤破了所有 100 个泡泡！
            </div>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all"
            >
              再来一次
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-center text-xs text-gray-500">
        点击泡泡挤破它们，全部挤完即可完成发泄！
      </div>

      {/* Intensity slider */}
      {!isComplete && (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-white text-xs">情绪强度</label>
            <span className="text-purple-400 text-xs font-bold">{intensity}</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      )}
    </div>
  )
}
