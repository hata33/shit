'use client'

import { useState, useEffect, useRef } from 'react'

export function useSoundEffects() {
  const [enabled, setEnabled] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Load preference from localStorage
    const saved = localStorage.getItem('soundEnabled')
    if (saved) {
      setEnabled(JSON.parse(saved))
    }
  }, [])

  const toggleSound = () => {
    const newValue = !enabled
    setEnabled(newValue)
    localStorage.setItem('soundEnabled', JSON.stringify(newValue))
  }

  const playExplosion = (intensity: number) => {
    if (!enabled) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const duration = 0.5 + intensity * 0.1

    // Create noise for explosion
    const bufferSize = ctx.sampleRate * duration
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2)
    }

    const noise = ctx.createBufferSource()
    noise.buffer = buffer

    // Create filter for explosion sound
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1000 + intensity * 200, ctx.currentTime)
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration)

    // Create gain for volume envelope
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.3 + intensity * 0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    noise.start()
  }

  const playClick = () => {
    if (!enabled) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)

    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.1)
  }

  const playAchievement = () => {
    if (!enabled) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    const ctx = audioContextRef.current

    // Play ascending notes
    const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1)

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.1)
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.1 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime + i * 0.1)
      osc.stop(ctx.currentTime + i * 0.1 + 0.3)
    })
  }

  return {
    enabled,
    toggleSound,
    playExplosion,
    playClick,
    playAchievement,
  }
}
