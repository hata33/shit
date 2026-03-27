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
  const [shouldPlay, setShouldPlay] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio()
      audioRef.current.crossOrigin = 'anonymous' // Handle CORS
      audioRef.current.volume = volume

      const audio = audioRef.current

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime)
      }

      const handleEnded = () => {
        // Play next track when current ends
        const nextIndex = (currentIndex + 1) % playlist.length
        if (playlist.length > 0) {
          setCurrentTrack(playlist[nextIndex])
          setCurrentIndex(nextIndex)
          setShouldPlay(true)
        }
      }

      const handleCanPlay = () => {
        if (shouldPlay && audio.src) {
          audio.play().catch(err => {
            console.error('Play error:', err)
            setIsPlaying(false)
            setShouldPlay(false)
          })
          setShouldPlay(false)
        }
      }

      const handleError = (e: Event) => {
        console.error('Audio error:', e)
        const audio = e.target as HTMLAudioElement
        console.error('Failed to load audio:', audio.src)

        setIsPlaying(false)
        setShouldPlay(false)

        // Try to provide more helpful error info
        if (audio.error) {
          console.error('Audio error code:', audio.error.code)
          console.error('Audio error message:', audio.error.message)
        }
      }

      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('ended', handleEnded)
      audio.addEventListener('canplay', handleCanPlay)
      audio.addEventListener('error', handleError)

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('ended', handleEnded)
        audio.removeEventListener('canplay', handleCanPlay)
        audio.removeEventListener('error', handleError)
        audio.pause()
        audio.src = ''
      }
    }
  }, [shouldPlay, currentIndex, playlist])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  // Load track when currentTrack changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audio = audioRef.current

      // Pause and reset current playback
      audio.pause()
      audio.currentTime = 0
      setCurrentTime(0)

      // Load new source
      audio.src = currentTrack.url
      audio.load()

      // If we want to play, wait for canplay event
      if (shouldPlay) {
        // The canplay event handler will take care of playing
      } else {
        // Just load, don't play
        setIsPlaying(false)
      }
    }
  }, [currentTrack, shouldPlay])

  const playTrack = useCallback((track: MusicTrack, index: number) => {
    setCurrentTrack(track)
    setCurrentIndex(index)
    setIsPlaying(true)
    setShouldPlay(true)

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = track.url
      audioRef.current.load()
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (!currentTrack || !audioRef.current) return

    const audio = audioRef.current

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Toggle play error:', err)
          setIsPlaying(false)
        })
    }
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
    setShouldPlay(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
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
