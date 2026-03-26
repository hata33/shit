export interface MusicTrack {
  id: string
  title: string
  artist: string
  url: string
  duration: number
  mood: 'anger' | 'anxiety' | 'sadness' | 'relax'
  coverImage?: string
}

export const MUSIC_LIBRARY: MusicTrack[] = [
  // Anger releasing music - high energy, powerful
  {
    id: 'anger-1',
    title: 'Thunderstrike',
    artist: 'Power Sounds',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_514b69c098.mp3',
    duration: 180,
    mood: 'anger',
    coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=100&h=100&fit=crop',
  },
  {
    id: 'anger-2',
    title: 'Epic Storm',
    artist: 'Dramatic Beats',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3',
    duration: 200,
    mood: 'anger',
    coverImage: 'https://images.unsplash.com/photo-1505322022379-7c3353ee6291?w=100&h=100&fit=crop',
  },
  {
    id: 'anger-3',
    title: 'Power Surge',
    artist: 'Energy Flow',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_27315d9306.mp3',
    duration: 165,
    mood: 'anger',
    coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
  },

  // Anxiety calming music - soothing, peaceful
  {
    id: 'anxiety-1',
    title: 'Peaceful Mind',
    artist: 'Calm Waves',
    url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
    duration: 240,
    mood: 'anxiety',
    coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop',
  },
  {
    id: 'anxiety-2',
    title: 'Gentle Breeze',
    artist: 'Serenity Sounds',
    url: 'https://cdn.pixabay.com/audio/2022/02/07/audio_8b43379164.mp3',
    duration: 200,
    mood: 'anxiety',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=100&h=100&fit=crop',
  },
  {
    id: 'anxiety-3',
    title: 'Inner Peace',
    artist: 'Zen Garden',
    url: 'https://cdn.pixabay.com/audio/2022/01/26/audio_ea9cd0c52b.mp3',
    duration: 180,
    mood: 'anxiety',
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=100&h=100&fit=crop',
  },

  // Sadness comforting music - warm, uplifting
  {
    id: 'sadness-1',
    title: 'Warm Embrace',
    artist: 'Comfort Tones',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_8e410a8666.mp3',
    duration: 210,
    mood: 'sadness',
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
  },
  {
    id: 'sadness-2',
    title: 'Morning Light',
    artist: 'Hope Rising',
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_a96cffc1c1.mp3',
    duration: 195,
    mood: 'sadness',
    coverImage: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=100&h=100&fit=crop',
  },
  {
    id: 'sadness-3',
    title: 'Soft Landing',
    artist: 'Gentle Spirits',
    url: 'https://cdn.pixabay.com/audio/2022/02/23/audio_9a60c4ecc3.mp3',
    duration: 220,
    mood: 'sadness',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop',
  },

  // Relax music - ambient, chill
  {
    id: 'relax-1',
    title: 'Ocean Dreams',
    artist: 'Ambient Waves',
    url: 'https://cdn.pixabay.com/audio/2022/04/27/audio_67bcb45565.mp3',
    duration: 300,
    mood: 'relax',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100&h=100&fit=crop',
  },
  {
    id: 'relax-2',
    title: 'Forest Whisper',
    artist: 'Nature Sounds',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_c8e8e7f5a0.mp3',
    duration: 280,
    mood: 'relax',
    coverImage: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=100&h=100&fit=crop',
  },
  {
    id: 'relax-3',
    title: 'Starry Night',
    artist: 'Cosmic Dreams',
    url: 'https://cdn.pixabay.com/audio/2022/01/26/audio_9ff9b8e8e7.mp3',
    duration: 260,
    mood: 'relax',
    coverImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=100&h=100&fit=crop',
  },
]

export const MOOD_CONFIGS = {
  anger: {
    label: '愤怒发泄',
    icon: '😤',
    color: 'from-red-600 to-orange-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
    description: '高能量音乐，释放愤怒情绪',
  },
  anxiety: {
    label: '焦虑缓解',
    icon: '😌',
    color: 'from-blue-600 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30',
    description: '舒缓音乐，平复焦虑心情',
  },
  sadness: {
    label: '悲伤安慰',
    icon: '🤗',
    color: 'from-purple-600 to-pink-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30',
    description: '温暖音乐，陪伴悲伤时刻',
  },
  relax: {
    label: '放松休息',
    icon: '😴',
    color: 'from-green-600 to-teal-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
    description: '环境音乐，享受宁静时光',
  },
}

export function getMusicByMood(mood: MusicTrack['mood']): MusicTrack[] {
  return MUSIC_LIBRARY.filter((track) => track.mood === mood)
}

export function getRecommendedMusic(vents: any[]): MusicTrack[] {
  if (vents.length === 0) return []

  // Analyze recent vents to determine mood
  const recentVents = vents.slice(0, 10)
  const highIntensityCount = recentVents.filter((v) => v.intensity >= 4).length
  const avgIntensity = recentVents.reduce((sum, v) => sum + v.intensity, 0) / recentVents.length

  // Check tags for mood indicators
  const hasAnger = recentVents.some((v) => v.tags?.includes('#狂点发泄'))
  const hasAnxiety = recentVents.some((v) => v.tags?.includes('#AI焦虑'))

  // Recommend based on analysis
  if (hasAnger || highIntensityCount >= 3) {
    return getMusicByMood('anger').slice(0, 3)
  }
  if (hasAnxiety || avgIntensity >= 3) {
    return getMusicByMood('anxiety').slice(0, 3)
  }
  if (avgIntensity <= 2) {
    return getMusicByMood('relax').slice(0, 3)
  }

  return getMusicByMood('sadness').slice(0, 3)
}
