'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export interface PuzzlePiece {
  id: string
  correctPosition: { row: number; col: number }
  currentPosition: { row: number; col: number }
  imageData: string
}

export interface PuzzleStats {
  completed: number
  totalTime: number
  bestTime: number
}

interface PuzzleGameProps {
  gridSize: number
  imageUrl: string
  onComplete: (timeSpent: number) => void
}

export function usePuzzleGame({ gridSize, imageUrl, onComplete }: PuzzleGameProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [startTime, setStartTime] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null)
  const [moves, setMoves] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Load and slice image
  useEffect(() => {
    const loadImage = async () => {
      setIsLoading(true)
      try {
        const img = new Image()
        img.crossOrigin = 'anonymous'

        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
          img.src = imageUrl
        })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Could not get canvas context')

        const size = 400 // Base size for puzzle
        canvas.width = size
        canvas.height = size

        ctx.drawImage(img, 0, 0, size, size)

        const newPieces: PuzzlePiece[] = []
        const pieceSize = size / gridSize

        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const pieceCanvas = document.createElement('canvas')
            pieceCanvas.width = pieceSize
            pieceCanvas.height = pieceSize
            const pieceCtx = pieceCanvas.getContext('2d')

            if (pieceCtx) {
              pieceCtx.drawImage(
                canvas,
                col * pieceSize,
                row * pieceSize,
                pieceSize,
                pieceSize,
                0,
                0,
                pieceSize,
                pieceSize
              )
            }

            newPieces.push({
              id: `${row}-${col}`,
              correctPosition: { row, col },
              currentPosition: { row, col },
              imageData: pieceCanvas.toDataURL(),
            })
          }
        }

        // Shuffle pieces
        const shuffled = [...newPieces]
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          const tempPos = shuffled[i].currentPosition
          shuffled[i].currentPosition = shuffled[j].currentPosition
          shuffled[j].currentPosition = tempPos
        }

        setPieces(shuffled)
        setStartTime(Date.now())
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to load image:', error)
        setIsLoading(false)
      }
    }

    loadImage()
  }, [gridSize, imageUrl])

  // Timer
  useEffect(() => {
    if (!isLoading && !isComplete) {
      timerRef.current = setInterval(() => {
        setCurrentTime(Date.now() - startTime)
      }, 100)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isLoading, isComplete, startTime])

  // Check completion
  useEffect(() => {
    if (pieces.length === 0) return

    const complete = pieces.every(
      (piece) =>
        piece.currentPosition.row === piece.correctPosition.row &&
        piece.currentPosition.col === piece.correctPosition.col
    )

    if (complete && !isComplete && pieces.length > 0) {
      setIsComplete(true)
      const timeSpent = Date.now() - startTime
      onComplete(timeSpent)
    }
  }, [pieces, isComplete, startTime, onComplete])

  const handlePieceClick = useCallback((pieceId: string) => {
    if (isComplete) return

    if (selectedPiece === null) {
      setSelectedPiece(pieceId)
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null)
    } else {
      // Swap pieces
      setPieces((prev) =>
        prev.map((piece) => {
          if (piece.id === selectedPiece) {
            const otherPiece = prev.find((p) => p.id === pieceId)
            return otherPiece ? { ...piece, currentPosition: otherPiece.currentPosition } : piece
          }
          if (piece.id === pieceId) {
            const otherPiece = prev.find((p) => p.id === selectedPiece)
            return otherPiece ? { ...piece, currentPosition: otherPiece.currentPosition } : piece
          }
          return piece
        })
      )
      setMoves((prev) => prev + 1)
      setSelectedPiece(null)
    }
  }, [selectedPiece, isComplete])

  const resetGame = useCallback(() => {
    setIsComplete(false)
    setCurrentTime(0)
    setMoves(0)
    setSelectedPiece(null)
    setStartTime(Date.now())

    // Reshuffle pieces
    setPieces((prev) => {
      const shuffled = [...prev]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const tempPos = shuffled[i].currentPosition
        shuffled[i].currentPosition = shuffled[j].currentPosition
        shuffled[j].currentPosition = tempPos
      }
      return shuffled
    })
  }, [])

  const getPieceAtPosition = useCallback((row: number, col: number) => {
    return pieces.find((p) => p.currentPosition.row === row && p.currentPosition.col === col)
  }, [pieces])

  return {
    pieces,
    isComplete,
    isLoading,
    currentTime,
    selectedPiece,
    moves,
    handlePieceClick,
    resetGame,
    getPieceAtPosition,
  }
}
