'use client'

import { useState } from 'react'
import { usePuzzleGame } from '../hooks/usePuzzleGame'

interface PuzzleGameProps {
  onComplete: (data: any, intensity: number) => void
}

const DIFFICULTY_LEVELS = {
  easy: { size: 2, name: '简单 (2x2)', gridSize: 2 },
  medium: { size: 3, name: '中等 (3x3)', gridSize: 3 },
  hard: { size: 4, name: '困难 (4x4)', gridSize: 4 },
}

const FREE_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', // Mountains
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop', // Waterfall
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop', // Mountains at night
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop', // Foggy landscape
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400&h=400&fit=crop', // Forest path
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop', // Green hills
  'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=400&fit=crop', // Sunset
  'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop', // Sunset over water
]

export function PuzzleGame({ onComplete }: PuzzleGameProps) {
  const [difficulty, setDifficulty] = useState<keyof typeof DIFFICULTY_LEVELS>('easy')
  const [currentImageUrl, setCurrentImageUrl] = useState(FREE_IMAGE_URLS[0])
  const [hasStarted, setHasStarted] = useState(false)

  const {
    pieces,
    isComplete,
    isLoading,
    currentTime,
    selectedPiece,
    moves,
    handlePieceClick,
    resetGame,
    getPieceAtPosition,
  } = usePuzzleGame({
    gridSize: DIFFICULTY_LEVELS[difficulty].gridSize,
    imageUrl: currentImageUrl,
    onComplete: (timeSpent) => {
      const intensity = moves < 10 ? 5 : moves < 20 ? 4 : moves < 30 ? 3 : 2
      onComplete(
        {
          content: `🧩 拼图发泄完成！\n难度: ${DIFFICULTY_LEVELS[difficulty].name}\n用时: ${(timeSpent / 1000).toFixed(1)}秒\n移动次数: ${moves}`,
          moves,
          timeSpent,
          difficulty,
        },
        intensity
      )
    },
  })

  const handleStart = (newDifficulty: keyof typeof DIFFICULTY_LEVELS) => {
    setDifficulty(newDifficulty)
    const randomImage = FREE_IMAGE_URLS[Math.floor(Math.random() * FREE_IMAGE_URLS.length)]
    setCurrentImageUrl(randomImage)
    setHasStarted(true)
  }

  const handleNewGame = () => {
    const randomImage = FREE_IMAGE_URLS[Math.floor(Math.random() * FREE_IMAGE_URLS.length)]
    setCurrentImageUrl(randomImage)
    resetGame()
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (!hasStarted) {
    return (
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">🧩 拼图发泄</h3>
        <p className="text-gray-400 text-sm mb-6">
          通过拼图来放松心情！选择难度，点击交换拼图块位置，完成图片拼合。
        </p>

        <div className="space-y-3">
          <p className="text-white text-sm font-medium">选择难度:</p>
          {(Object.keys(DIFFICULTY_LEVELS) as Array<keyof typeof DIFFICULTY_LEVELS>).map((level) => (
            <button
              key={level}
              onClick={() => handleStart(level)}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-medium transition-all active:scale-95 shadow-lg hover:shadow-blue-500/50"
            >
              {DIFFICULTY_LEVELS[level].name}
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-900/50 rounded-xl">
          <p className="text-xs text-gray-400 mb-2">💡 玩法说明:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• 点击一个拼图块选中它</li>
            <li>• 再点击另一个拼图块交换位置</li>
            <li>• 完成拼图发泄你的压力！</li>
          </ul>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
          <p className="text-gray-400">加载拼图中...</p>
        </div>
      </div>
    )
  }

  const gridSize = DIFFICULTY_LEVELS[difficulty].gridSize
  const pieceSize = 400 / gridSize

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">🧩 拼图发泄</h3>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            移动: <span className="text-white font-bold">{moves}</span>
          </div>
          <div className="text-sm text-gray-400">
            时间: <span className="text-white font-bold">{formatTime(currentTime)}</span>
          </div>
        </div>
      </div>

      {/* Puzzle Grid */}
      <div className="flex justify-center mb-4">
        <div
          className="relative bg-gray-900 rounded-lg overflow-hidden shadow-2xl"
          style={{
            width: '400px',
            height: '400px',
            maxWidth: '100%',
            aspectRatio: '1/1',
          }}
        >
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => {
              const piece = getPieceAtPosition(row, col)
              if (!piece) return null

              const isSelected = selectedPiece === piece.id
              const isCorrectPosition =
                piece.currentPosition.row === piece.correctPosition.row &&
                piece.currentPosition.col === piece.correctPosition.col

              return (
                <div
                  key={piece.id}
                  onClick={() => handlePieceClick(piece.id)}
                  className="absolute cursor-pointer transition-all hover:brightness-110"
                  style={{
                    left: `${col * pieceSize}px`,
                    top: `${row * pieceSize}px`,
                    width: `${pieceSize}px`,
                    height: `${pieceSize}px`,
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: isSelected
                      ? '0 0 0 3px #3b82f6, 0 0 20px rgba(59, 130, 246, 0.5)'
                      : isCorrectPosition
                        ? 'inset 0 0 0 1px rgba(34, 197, 94, 0.3)'
                        : 'none',
                    transform: isSelected ? 'scale(0.95)' : 'scale(1)',
                    zIndex: isSelected ? 10 : 1,
                  }}
                >
                  <img
                    src={piece.imageData}
                    alt={`Puzzle piece ${piece.id}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              )
            })
          )}

          {/* Completion overlay */}
          {isComplete && (
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/80 to-emerald-600/80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🎉</div>
                <div className="text-white text-2xl font-bold mb-2">完成！</div>
                <div className="text-white/90 text-sm">
                  用时 {formatTime(currentTime)} · 移动 {moves} 次
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleNewGame}
          className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-medium transition-all active:scale-95 shadow-lg"
        >
          🔄 新游戏
        </button>
        <button
          onClick={() => setHasStarted(false)}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-all"
        >
          📋 选难度
        </button>
      </div>

      {/* Hint */}
      {selectedPiece && (
        <div className="mt-4 text-center text-sm text-blue-400">
          点击另一个拼图块来交换位置
        </div>
      )}
    </div>
  )
}
