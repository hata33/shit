'use client'

import { useState, useRef, useEffect } from 'react'

interface Drawing {
  id: string
  timestamp: number
  imageData: string
  intensity: number
}

interface CanvasDrawProps {
  onDrawingComplete: (imageData: string, intensity: number) => void
}

export function CanvasDraw({ onDrawingComplete }: CanvasDrawProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState('#ff4444')
  const [isEraser, setIsEraser] = useState(false)
  const [intensity, setIntensity] = useState(3)
  const [history, setHistory] = useState<ImageData[]>([])
  const [historyStep, setHistoryStep] = useState(-1)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [drawings, setDrawings] = useState<Drawing[]>([])

  const colors = [
    '#ff4444', '#ff8800', '#ffcc00', '#44ff44', '#44ffff',
    '#4488ff', '#8844ff', '#ff44ff', '#ffffff', '#000000',
  ]

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 400

    // Fill with dark background
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Load saved drawings from localStorage
    const saved = localStorage.getItem('drawings')
    if (saved) {
      setDrawings(JSON.parse(saved))
    }
  }, [])

  // Save canvas state for undo
  const saveState = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height)
    if (imageData) {
      const newHistory = history.slice(0, historyStep + 1)
      newHistory.push(imageData)
      setHistory(newHistory)
      setHistoryStep(newHistory.length - 1)
    }
  }

  // Start drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    saveState()

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  // Draw
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.lineTo(x, y)
    ctx.strokeStyle = isEraser ? '#1a1a2e' : brushColor
    ctx.lineWidth = isEraser ? brushSize * 3 : brushSize
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false)
  }

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveState()
  }

  // Undo
  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      setHistoryStep(historyStep - 1)
      ctx.putImageData(history[historyStep - 1], 0, 0)
    }
  }

  // Redo
  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      setHistoryStep(historyStep + 1)
      ctx.putImageData(history[historyStep + 1], 0, 0)
    }
  }

  // Save drawing
  const saveDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.toDataURL('image/png')

    const newDrawing: Drawing = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageData,
      intensity,
    }

    const newDrawings = [newDrawing, ...drawings]
    setDrawings(newDrawings)
    localStorage.setItem('drawings', JSON.stringify(newDrawings))

    // Clear canvas
    clearCanvas()

    // Trigger completion callback
    onDrawingComplete(imageData, intensity)
  }

  // Load drawing
  const loadDrawing = (drawing: Drawing) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      saveState()
    }
    img.src = drawing.imageData
  }

  // Delete drawing
  const deleteDrawing = (id: string) => {
    const newDrawings = drawings.filter((d) => d.id !== id)
    setDrawings(newDrawings)
    localStorage.setItem('drawings', JSON.stringify(newDrawings))
  }

  return (
    <div className="space-y-6">
      {/* Canvas */}
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">🎨 涂鸦发泄</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyStep <= 0}
              className="px-3 py-1 text-sm bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↩️ 撤销
            </button>
            <button
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              className="px-3 py-1 text-sm bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↪️ 重做
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-1 text-sm bg-red-900/50 text-red-400 rounded-lg hover:bg-red-800/50"
            >
              🗑️ 清空
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full rounded-xl cursor-crosshair"
          style={{ touchAction: 'none' }}
        />
      </div>

      {/* Controls */}
      <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
        {/* Brush Size */}
        <div className="mb-4">
          <label className="text-white text-sm mb-2 block">
            画笔大小: <span className="text-purple-400 font-bold">{brushSize}px</span>
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        {/* Intensity */}
        <div className="mb-4">
          <label className="text-white text-sm mb-2 block">
            情绪强度: <span className="text-purple-400 font-bold">{intensity}</span>
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>轻松</span>
            <span>崩溃</span>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mb-4">
          <label className="text-white text-sm mb-2 block">颜色选择</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setBrushColor(color)
                  setIsEraser(false)
                }}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  brushColor === color && !isEraser
                    ? 'border-white scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
            <button
              onClick={() => {
                setShowColorPicker(!showColorPicker)
              }}
              className="w-10 h-10 rounded-lg border-2 border-gray-600 bg-gradient-to-br from-pink-500 to-purple-500 hover:scale-105 transition-all"
            >
              🎨
            </button>
            <button
              onClick={() => setIsEraser(!isEraser)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isEraser
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              🧹 橡皮擦
            </button>
          </div>

          {showColorPicker && (
            <input
              type="color"
              value={brushColor}
              onChange={(e) => {
                setBrushColor(e.target.value)
                setIsEraser(false)
              }}
              className="mt-2"
            />
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={saveDrawing}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-bold transition-all"
        >
          🎨 完成发泄
        </button>
      </div>

      {/* Drawing History */}
      {drawings.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">📝 涂鸦历史 ({drawings.length})</h3>
          <div className="grid grid-cols-3 gap-4">
            {drawings.slice(0, 6).map((drawing) => (
              <div key={drawing.id} className="group relative">
                <img
                  src={drawing.imageData}
                  alt="Drawing"
                  className="w-full rounded-lg border border-gray-600 cursor-pointer hover:border-purple-500 transition-colors"
                  onClick={() => loadDrawing(drawing)}
                />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteDrawing(drawing.id)
                    }}
                    className="p-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
                  🔥{drawing.intensity}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
