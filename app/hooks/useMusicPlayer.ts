'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { MUSIC_LIBRARY, MusicTrack } from '../data/musicLibrary'

export function useMusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [playlist, setPlaylist] = useState<MusicTrack[]>(MUSIC_LIBRARY)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedMood, setSelectedMood] = useState<MusicTrack['mood'] | 'all'>('all')

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      audioRef.current.volume = volume

      const audio = audioRef.current

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      const handleEnded = () => {
        playNext()
      }

      const handleLoad = () => {
        setCurrentTime(0)
      }

      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('loadedmetadata', handleLoad)

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('loadedmetadata', handleLoad)
        audio.pause()
        audio.src = ''
      }
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Load track
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.url
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      }
    }
  }, [currentTrack])

  const playTrack = useCallback((track: MusicTrack, index: number) => {
    setCurrentTrack(track)
    setCurrentIndex(index)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.src = track.url
      audioRef.current.play().catch(console.error)
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!currentTrack || !audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(console.error)
    }
    setIsPlaying(!isPlaying)
  }, [currentTrack, isPlaying])

  const playNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % playlist.length
    playTrack(playlist[nextIndex], nextIndex)
  }, [currentIndex, playlist, playTrack])

  const playPrevious = useCallback(() => {
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    playTrack(playlist[prevIndex], prevIndex)
  }, [currentIndex, playlist, playTrack])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const setMood = useCallback((mood: MusicTrack['mood'] | 'all') => {
    setSelectedMood(mood)
    if (mood === 'all') {
      setPlaylist(MUSIC_LIBRARY)
    } else {
      setPlaylist(MUSIC_LIBRARY.filter((track) => track.mood === mood))
    }
    setCurrentIndex(0)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    playlist,
    currentIndex,
    selectedMood,
    playTrack,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    setMood,
    formatTime,
    audioRef,
  }
}
