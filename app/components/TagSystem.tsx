'use client'

import { useState, useEffect } from 'react'

interface TagSystemProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

const PRESET_TAGS = [
  '#加班',
  '#通勤',
  '#领导',
  '#同事',
  '#需求',
  '#会议',
  '#PPT',
  '#背锅',
  '#画饼',
  '#低效',
  '#薪资',
  '#内卷',
  '#996',
  '#迷茫',
  '#焦虑',
  '#想辞职',
  '#周末加班',
  '#改需求',
  '#甩锅',
  '#无意义',
]

export function TagSystem({ selectedTags, onTagsChange }: TagSystemProps) {
  const [customTag, setCustomTag] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [allTags, setAllTags] = useState<string[]>(PRESET_TAGS)

  useEffect(() => {
    // Load custom tags from localStorage
    const saved = localStorage.getItem('customTags')
    if (saved) {
      setAllTags([...PRESET_TAGS, ...JSON.parse(saved)])
    }
  }, [])

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const addCustomTag = () => {
    const tag = customTag.trim()
    if (!tag) return

    // Add # if not present
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`

    if (allTags.includes(formattedTag)) {
      // Tag exists, just select it
      if (!selectedTags.includes(formattedTag)) {
        onTagsChange([...selectedTags, formattedTag])
      }
    } else {
      // New custom tag
      const newTags = [...allTags, formattedTag]
      setAllTags(newTags)

      // Save to localStorage
      const customOnly = newTags.filter((t) => !PRESET_TAGS.includes(t))
      localStorage.setItem('customTags', JSON.stringify(customOnly))

      onTagsChange([...selectedTags, formattedTag])
    }

    setCustomTag('')
    setShowCustomInput(false)
  }

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-red-500/20 text-red-300 border-red-500/30',
      'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'bg-green-500/20 text-green-300 border-green-500/30',
      'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'bg-pink-500/20 text-pink-300 border-pink-500/30',
    ]

    // Use consistent color based on tag
    const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  return (
    <div className="space-y-3">
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`${getTagColor(tag)} px-3 py-1 rounded-full text-sm border hover:opacity-80 transition-opacity flex items-center gap-1`}
            >
              {tag}
              <span className="text-xs opacity-60">✕</span>
            </button>
          ))}
        </div>
      )}

      {/* Preset tags */}
      <div className="space-y-2">
        <label className="text-white text-sm">选择标签</label>
        <div className="flex flex-wrap gap-2">
          {allTags.slice(0, 12).map((tag) => {
            const isSelected = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`
                  px-3 py-1 rounded-full text-sm border transition-all
                  ${isSelected ? getTagColor(tag) : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:border-gray-500'}
                `}
              >
                {tag}
              </button>
            )
          })}
        </div>

        {/* More tags toggle */}
        {allTags.length > 12 && (
          <details className="group">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
              查看更多标签 ▼
            </summary>
            <div className="mt-2 flex flex-wrap gap-2">
              {allTags.slice(12).map((tag) => {
                const isSelected = selectedTags.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`
                      px-3 py-1 rounded-full text-sm border transition-all
                      ${isSelected ? getTagColor(tag) : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:border-gray-500'}
                    `}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </details>
        )}
      </div>

      {/* Custom tag input */}
      {showCustomInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
            placeholder="输入自定义标签..."
            className="flex-1 px-3 py-2 bg-gray-900/50 text-white placeholder-gray-500 rounded-lg border border-gray-600 focus:outline-none focus:border-red-500"
            autoFocus
          />
          <button
            onClick={addCustomTag}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            添加
          </button>
          <button
            onClick={() => {
              setShowCustomInput(false)
              setCustomTag('')
            }}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            取消
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCustomInput(true)}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <span>➕</span> 添加自定义标签
        </button>
      )}
    </div>
  )
}

// Tag filter component
export function TagFilter({
  availableTags,
  selectedFilter,
  onFilterChange,
}: {
  availableTags: string[]
  selectedFilter: string | null
  onFilterChange: (tag: string | null) => void
}) {
  return (
    <div className="space-y-2">
      <label className="text-white text-sm">按标签筛选</label>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange(null)}
          className={`px-3 py-1 rounded-full text-sm border transition-all ${
            selectedFilter === null
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:border-gray-500'
          }`}
        >
          全部
        </button>
        {availableTags.map((tag) => {
          const isSelected = selectedFilter === tag
          return (
            <button
              key={tag}
              onClick={() => onFilterChange(isSelected ? null : tag)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${
                isSelected ? 'bg-red-500 text-white border-red-500' : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:border-gray-500'
              }`}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}
