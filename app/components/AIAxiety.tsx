'use client'

import { useState } from 'react'

interface AIAxietyProps {
  onVent: (content: string, intensity: number) => void
}

export function AIAxiety({ onVent }: AIAxietyProps) {
  const [selectedAnxieties, setSelectedAnxieties] = useState<string[]>([])
  const [customAnxiety, setCustomAnxiety] = useState('')
  const [intensity, setIntensity] = useState(3)

  const aiAnxieties = [
    'AI会取代我的工作 😰',
    'AI生成的代码比我写得好 🤖',
    '面试官问我有没有用AI 😓',
    '领导让我学AI工具 😡',
    'AI让我觉得自己很没用 😔',
    '担心被AI淘汰 😱',
    'AI发展太快跟不上了 😮‍💨',
    '不知道AI是助手还是对手 🤔',
    'AI写的文章比我还好 📝',
    'AI画的画比我还专业 🎨',
    '每天都要学新AI工具累死了 😩',
    'AI能做我的工作还要我干嘛 🤬',
    '担心35岁被AI优化 👴',
    'AI让我职业没有安全感 💼',
    'AI回答问题比我还快 ⚡',
    'AI让我的技能贬值了 📉',
    '不知道该怎么面对AI时代 🌪️',
    'AI让我失去竞争优势 😞',
    '怕被AI算法替代 🤖',
    'AI焦虑到失眠 😴',
  ]

  const toggleAnxiety = (anxiety: string) => {
    if (selectedAnxieties.includes(anxiety)) {
      setSelectedAnxieties(selectedAnxieties.filter((a) => a !== anxiety))
    } else {
      setSelectedAnxieties([...selectedAnxieties, anxiety])
    }
  }

  const handleSubmit = () => {
    if (selectedAnxieties.length === 0 && !customAnxiety.trim()) return

    const content = `🤖 去他妈的AI焦虑！\n\n${
      selectedAnxieties.length > 0
        ? selectedAnxieties.map((a, i) => `${i + 1}. ${a}`).join('\n')
        : ''
    }${
      customAnxiety.trim() ? `\n\n额外想说：${customAnxiety.trim()}` : ''
    }`

    onVent(content, intensity)
    setSelectedAnxieties([])
    setCustomAnxiety('')
  }

  const addCustom = () => {
    if (!customAnxiety.trim()) return
    if (!aiAnxieties.includes(customAnxiety)) {
      aiAnxieties.push(customAnxiety)
    }
    toggleAnxiety(customAnxiety)
    setCustomAnxiety('')
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur rounded-2xl p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">🤖</span>
          去他妈的AI焦虑！
        </h3>
        <div className="text-sm text-purple-300">
          已选: {selectedAnxieties.length}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 p-4 bg-purple-950/50 rounded-xl border border-purple-700/50">
        <p className="text-gray-300 text-sm">
          AI焦虑很正常！选选你现在的感受，然后一起喊出：<span className="text-purple-400 font-bold">去他妈的AI焦虑！</span>
        </p>
      </div>

      {/* Intensity */}
      <div className="mb-6">
        <label className="text-white text-sm mb-2 block">
          焦虑强度: <span className="text-purple-400 font-bold">{intensity}</span>
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
          <span>有点烦</span>
          <span>快崩溃</span>
        </div>
      </div>

      {/* Anxiety Selection */}
      <div className="space-y-4 mb-6">
        <label className="text-white text-sm block">选择你的AI焦虑（可多选）：</label>

        <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
          {aiAnxieties.map((anxiety) => {
            const isSelected = selectedAnxieties.includes(anxiety)
            return (
              <button
                key={anxiety}
                onClick={() => toggleAnxiety(anxiety)}
                className={`
                  text-left px-4 py-3 rounded-lg text-sm transition-all
                  ${isSelected
                    ? 'bg-purple-500 text-white scale-105 shadow-lg shadow-purple-500/30'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  {isSelected ? '✅' : '⬜'}
                  <span className={isSelected ? 'font-medium' : ''}>{anxiety}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Custom Input */}
        <div className="flex gap-2 mt-4">
          <input
            type="text"
            value={customAnxiety}
            onChange={(e) => setCustomAnxiety(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustom()}
            placeholder="添加你自己的AI焦虑..."
            className="flex-1 px-4 py-3 bg-gray-900/50 text-white placeholder-gray-500 rounded-xl border border-gray-600 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={addCustom}
            className="px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors"
          >
            添加
          </button>
        </div>
      </div>

      {/* Quick Select All */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedAnxieties(aiAnxieties.slice(0, 5))}
          className="flex-1 py-2 px-4 bg-purple-900/50 text-purple-300 rounded-lg text-sm hover:bg-purple-800/50 transition-colors"
        >
          😰 选5个最常见的
        </button>
        <button
          onClick={() => setSelectedAnxieties([...aiAnxieties])}
          className="flex-1 py-2 px-4 bg-purple-900/50 text-purple-300 rounded-lg text-sm hover:bg-purple-800/50 transition-colors"
        >
          🤯 全都要！
        </button>
        <button
          onClick={() => setSelectedAnxieties([])}
          className="flex-1 py-2 px-4 bg-gray-700 text-gray-400 rounded-lg text-sm hover:bg-gray-600 transition-colors"
        >
          🗑️ 清空
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedAnxieties.length === 0}
        className={`
          w-full py-4 rounded-xl font-bold text-lg transition-all relative
          ${selectedAnxieties.length > 0
            ? 'bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 active:scale-95 shadow-lg hover:shadow-purple-500/50'
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {selectedAnxieties.length > 0 ? (
          <>
            <span className="text-2xl mr-2">🤖</span>
            去他妈的AI焦虑！
            <span className="text-sm ml-2 opacity-80">({selectedAnxieties.length}条)</span>
          </>
        ) : (
          '选择至少一条焦虑'
        )}
      </button>

      {/* Motivational Quote */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm italic">
          "AI是工具，不是你的替代品。你的价值不会因为AI而减少。"
        </p>
        <p className="text-purple-400 text-xs mt-2">
          💪 记住：你的经验、创造力、情感理解，AI永远学不会。
        </p>
      </div>
    </div>
  )
}
