'use client'

import { useState, useEffect } from 'react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
  progress: number
  target: number
}

export const ACHIEVEMENTS_DEFINITIONS: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  {
    id: 'first-vent',
    title: '初次发泄',
    description: '完成第一次发泄',
    icon: '🎉',
    target: 1,
  },
  {
    id: 'vent-10',
    title: '发泄新手',
    description: '累计发泄10次',
    icon: '🌟',
    target: 10,
  },
  {
    id: 'vent-50',
    title: '发泄达人',
    description: '累计发泄50次',
    icon: '💪',
    target: 50,
  },
  {
    id: 'vent-100',
    title: '发泄大师',
    description: '累计发泄100次',
    icon: '🏆',
    target: 100,
  },
  {
    id: 'streak-3',
    title: '连续三天',
    description: '连续3天发泄',
    icon: '🔥',
    target: 3,
  },
  {
    id: 'streak-7',
    title: '一周坚持',
    description: '连续7天发泄',
    icon: '⚡',
    target: 7,
  },
  {
    id: 'streak-30',
    title: '月度冠军',
    description: '连续30天发泄',
    icon: '👑',
    target: 30,
  },
  {
    id: 'intensity-5',
    title: '情绪爆发',
    description: '使用最高强度发泄',
    icon: '💥',
    target: 1,
  },
  {
    id: 'night-owl',
    title: '夜猫子',
    description: '在午夜12点后发泄',
    icon: '🦉',
    target: 1,
  },
  {
    id: 'early-bird',
    title: '早起鸟',
    description: '在早上6点前发泄',
    icon: '🐦',
    target: 1,
  },
  {
    id: 'long-vent',
    title: '话痨',
    description: '单次发泄超过100字',
    icon: '📝',
    target: 1,
  },
  {
    id: 'all-effects',
    title: '特效收藏家',
    description: '尝试所有特效类型',
    icon: '🎨',
    target: 5,
  },
]

export function useAchievements(vents: any[]) {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null)

  useEffect(() => {
    // Load achievements from localStorage
    const saved = localStorage.getItem('achievements')
    if (saved) {
      setAchievements(JSON.parse(saved))
    } else {
      // Initialize achievements
      const initial = ACHIEVEMENTS_DEFINITIONS.map((a) => ({
        ...a,
        unlocked: false,
        progress: 0,
      }))
      setAchievements(initial)
    }
  }, [])

  // Save achievements to localStorage
  useEffect(() => {
    if (achievements.length > 0) {
      localStorage.setItem('achievements', JSON.stringify(achievements))
    }
  }, [achievements])

  const calculateStreak = (vents: any[]) => {
    if (vents.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const ventDates = vents
      .map((v) => new Date(v.timestamp))
      .map((d) => {
        d.setHours(0, 0, 0, 0)
        return d.getTime()
      })
      .filter((date, i, arr) => arr.indexOf(date) === i)
      .sort((a, b) => b - a)

    let streak = 0
    let currentDate = today.getTime()

    for (const date of ventDates) {
      const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24))
      if (diffDays === streak) {
        streak++
        currentDate = date
      } else {
        break
      }
    }

    return streak
  }

  const checkAchievements = (newVent?: any, usedEffects?: Set<string>) => {
    const updatedAchievements = [...achievements]
    const allVents = newVent ? [...vents, newVent] : vents
    let newUnlock: Achievement | null = null

    // Count total vents
    const ventCount = allVents.length

    // Calculate streak
    const streak = calculateStreak(allVents)

    // Check for intensity 5
    const hasIntensity5 = allVents.some((v) => v.intensity === 5)

    // Check for night owl (after midnight)
    const isNightOwl = allVents.some((v) => {
      const hour = new Date(v.timestamp).getHours()
      return hour >= 0 && hour < 6
    })

    // Check for early bird (before 6 AM)
    const isEarlyBird = allVents.some((v) => {
      const hour = new Date(v.timestamp).getHours()
      return hour >= 5 && hour < 6
    })

    // Check for long vent
    const hasLongVent = allVents.some((v) => v.content.length > 100)

    // Check effects used
    const effectsCount = usedEffects?.size || 0

    // Update each achievement
    updatedAchievements.forEach((achievement) => {
      switch (achievement.id) {
        case 'first-vent':
          achievement.progress = Math.min(ventCount, 1)
          if (!achievement.unlocked && ventCount >= 1) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'vent-10':
          achievement.progress = Math.min(ventCount, 10)
          if (!achievement.unlocked && ventCount >= 10) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'vent-50':
          achievement.progress = Math.min(ventCount, 50)
          if (!achievement.unlocked && ventCount >= 50) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'vent-100':
          achievement.progress = Math.min(ventCount, 100)
          if (!achievement.unlocked && ventCount >= 100) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'streak-3':
          achievement.progress = Math.min(streak, 3)
          if (!achievement.unlocked && streak >= 3) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'streak-7':
          achievement.progress = Math.min(streak, 7)
          if (!achievement.unlocked && streak >= 7) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'streak-30':
          achievement.progress = Math.min(streak, 30)
          if (!achievement.unlocked && streak >= 30) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'intensity-5':
          achievement.progress = hasIntensity5 ? 1 : 0
          if (!achievement.unlocked && hasIntensity5) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'night-owl':
          achievement.progress = isNightOwl ? 1 : 0
          if (!achievement.unlocked && isNightOwl) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'early-bird':
          achievement.progress = isEarlyBird ? 1 : 0
          if (!achievement.unlocked && isEarlyBird) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'long-vent':
          achievement.progress = hasLongVent ? 1 : 0
          if (!achievement.unlocked && hasLongVent) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
        case 'all-effects':
          achievement.progress = effectsCount
          if (!achievement.unlocked && effectsCount >= 5) {
            achievement.unlocked = true
            achievement.unlockedAt = Date.now()
            newUnlock = achievement
          }
          break
      }
    })

    setAchievements(updatedAchievements)

    if (newUnlock) {
      setShowAchievement(newUnlock)
      setTimeout(() => setShowAchievement(null), 4000)
    }

    return newUnlock
  }

  const resetAchievements = () => {
    if (confirm('确定要重置所有成就吗？')) {
      const initial = ACHIEVEMENTS_DEFINITIONS.map((a) => ({
        ...a,
        unlocked: false,
        progress: 0,
      }))
      setAchievements(initial)
      localStorage.removeItem('achievements')
    }
  }

  return {
    achievements,
    showAchievement,
    checkAchievements,
    resetAchievements,
    setShowAchievement,
  }
}
