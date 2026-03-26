'use client'

import { useMusicPlayer } from '../hooks/useMusicPlayer'
import { MOOD_CONFIGS, getRecommendedMusic } from '../data/musicLibrary'
import { useEffect, useState } from 'react'

interface MusicPlayerProps {
  onComplete: (data: any, intensity: number) => void
  vents: any[]
}

export function MusicPlayer({ onComplete, vents }: MusicPlayerProps) {
  const {
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
  } = useMusicPlayer()

  const [showRecommendations, setShowRecommendations] = useState(true)

  const recommendedTracks = getRecommendedMusic(vents)

  const handleTrackComplete = () => {
    const listenTime = currentTime
    const intensity = currentTrack?.mood === 'anger' ? 4 : currentTrack?.mood === 'anxiety' ? 3 : 2

    onComplete(
      {
        content: `🎵 音乐发泄完成！\n歌曲: ${currentTrack?.title}\n艺术家: ${currentTrack?.artist}\n情绪: ${MOOD_CONFIGS[currentTrack?.mood || 'relax'].label}\n播放时长: ${formatTime(listenTime)}`,
        trackTitle: currentTrack?.title,
        artist: currentTrack?.artist,
        mood: currentTrack?.mood,
        listenTime,
      },
      intensity
    )
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">🎵 音乐发泄</h3>
        <button
          onClick={() => setShowRecommendations(!showRecommendations)}
          className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors"
        >
          {showRecommendations ? '隐藏推荐' : '显示推荐'}
        </button>
      </div>

      {/* Mood Selector */}
      <div className="mb-6">
        <p className="text-white text-sm font-medium mb-3">选择情绪类型:</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setMood('all')}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              selectedMood === 'all'
                ? 'bg-gradient-to-r from-gray-600 to-gray-500 text-white scale-105'
                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
            }`}
          >
            🎵 全部
          </button>
          {(Object.keys(MOOD_CONFIGS) as Array<keyof typeof MOOD_CONFIGS>).map((mood) => (
            <button
              key={mood}
              onClick={() => setMood(mood)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                selectedMood === mood
                  ? `bg-gradient-to-r ${MOOD_CONFIGS[mood].color} text-white scale-105`
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {MOOD_CONFIGS[mood].icon} {MOOD_CONFIGS[mood].label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {showRecommendations && recommendedTracks.length > 0 && vents.length > 0 && (
        <div className={`mb-6 p-4 rounded-xl border ${MOOD_CONFIGS[recommendedTracks[0].mood].bgColor} ${MOOD_CONFIGS[recommendedTracks[0].mood].borderColor}`}>
          <p className="text-white text-sm font-medium mb-2">✨ 基于你的情绪推荐:</p>
          <div className="space-y-2">
            {recommendedTracks.map((track) => (
              <button
                key={track.id}
                onClick={() => playTrack(track, playlist.findIndex((t) => t.id === track.id))}
                className="w-full text-left p-2 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="text-white text-sm font-medium">{track.title}</div>
                <div className="text-gray-400 text-xs">{track.artist}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Track Info */}
      {currentTrack && (
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            {currentTrack.coverImage && (
              <img
                src={currentTrack.coverImage}
                alt={currentTrack.title}
                className="w-16 h-16 rounded-lg object-cover shadow-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-bold truncate">{currentTrack.title}</h4>
              <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${MOOD_CONFIGS[currentTrack.mood].bgColor} ${MOOD_CONFIGS[currentTrack.mood].borderColor} border`}>
                  {MOOD_CONFIGS[currentTrack.mood].icon} {MOOD_CONFIGS[currentTrack.mood].label}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div
              className="h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const percent = (e.clientX - rect.left) / rect.width
                seekTo(percent * currentTrack.duration)
              }}
            >
              <div
                className={`h-full bg-gradient-to-r ${MOOD_CONFIGS[currentTrack.mood].color} transition-all group-hover:brightness-110`}
                style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(currentTrack.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={playPrevious}
              className="p-3 text-gray-400 hover:text-white transition-colors"
              title="上一首"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            <button
              onClick={togglePlay}
              className={`p-4 rounded-full bg-gradient-to-r ${MOOD_CONFIGS[currentTrack.mood].color} text-white shadow-lg hover:scale-105 transition-all`}
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            <button
              onClick={playNext}
              className="p-3 text-gray-400 hover:text-white transition-colors"
              title="下一首"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {volume === 0 ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-xs text-gray-400 w-8">{Math.round(volume * 100)}%</span>
          </div>

          {/* Complete Button */}
          <button
            onClick={handleTrackComplete}
            className="w-full py-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white rounded-xl font-medium transition-all active:scale-95 shadow-lg"
          >
            ✓ 记录这次发泄
          </button>
        </div>
      )}

      {/* Playlist */}
      {playlist.length > 0 && !currentTrack && (
        <div className="space-y-2">
          <p className="text-white text-sm font-medium">
            {selectedMood === 'all' ? '全部歌曲' : MOOD_CONFIGS[selectedMood as keyof typeof MOOD_CONFIGS]?.label} ({playlist.length})
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {playlist.map((track, index) => (
              <button
                key={track.id}
                onClick={() => playTrack(track, index)}
                className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-800 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {track.coverImage && (
                    <img
                      src={track.coverImage}
                      alt={track.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">
                      {track.title}
                    </div>
                    <div className="text-gray-400 text-sm truncate">{track.artist}</div>
                  </div>
                  <div className="text-gray-500 text-xs">{formatTime(track.duration)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      {selectedMood !== 'all' && (
        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
          <p className="text-xs text-gray-400">{MOOD_CONFIGS[selectedMood as keyof typeof MOOD_CONFIGS]?.description}</p>
        </div>
      )}
    </div>
  )
}
