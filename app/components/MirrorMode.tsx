'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  mood?: string
}

interface MirrorModeProps {
  vents: any[]
}

export function MirrorMode({ vents }: MirrorModeProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mirrorSessions')
    if (saved) {
      const sessions = JSON.parse(saved)
      const latestSession = sessions[0]
      if (latestSession) {
        setMessages(latestSession.messages || [])
        setSessionId(latestSession.id)
      }
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Save messages to localStorage
  const saveMessages = (newMessages: Message[]) => {
    setMessages(newMessages)

    const saved = localStorage.getItem('mirrorSessions')
    const sessions = saved ? JSON.parse(saved) : []

    const currentSession = sessions.find((s: any) => s.id === sessionId)
    if (currentSession) {
      currentSession.messages = newMessages
      currentSession.updatedAt = Date.now()
    } else {
      sessions.unshift({
        id: sessionId || Date.now().toString(),
        messages: newMessages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
    }

    localStorage.setItem('mirrorSessions', JSON.stringify(sessions))
  }

  // Analyze recent vents and provide context
  const getVentContext = () => {
    if (vents.length === 0) return ''

    const recentVents = vents.slice(0, 5)
    const avgIntensity = vents.reduce((sum, v) => sum + v.intensity, 0) / vents.length

    let context = `用户最近的发泄记录（共${vents.length}条，平均强度${avgIntensity.toFixed(1)}）：\n\n`

    recentVents.forEach((vent, i) => {
      const date = new Date(vent.timestamp)
      const timeStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
      context += `${i + 1}. [${timeStr}] ${vent.content.substring(0, 50)}${vent.content.length > 50 ? '...' : ''}\n`
    })

    return context
  }

  // Send message to AI
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    saveMessages([...messages, userMessage])
    const userMsg = input.trim()
    setInput('')
    setIsTyping(true)

    // Check if API key is configured
    const apiKey = localStorage.getItem('claude_api_key')
    if (!apiKey) {
      // Fallback responses without API
      setTimeout(() => {
        const fallbackResponses = [
          `我理解你的感受。从你的发泄中，我能感受到你最近的情绪状态。

作为一个AI情绪分析师，我想告诉你：
1. 你的情绪是正常的，不要压抑
2. 发泄是健康的情绪出口
3. 记得照顾好自己，适当休息

需要我帮你分析更多吗？`,
          ]

        const aiMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
          timestamp: Date.now(),
        }

        saveMessages([...messages, userMessage, aiMessage])
        setIsTyping(false)
      }, 1500)
      return
    }

    // Call Claude API
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-10-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `你是一个温暖、理解力强的AI情绪分析师助手。你的职责是：

1. **理解与共情**：认真倾听用户的情绪困扰，给予理解和支持
2. **情绪分析**：基于用户的发泄内容，分析其情绪状态和可能的压力源
3. **建议提供**：给出实用、可操作的建议，帮助用户缓解压力
4. **积极引导**：引导用户看到积极的一面，保持希望

回复风格：
- 温暖、亲切，像朋友一样对话
- 不说教，不评判
- 简洁明了，避免长篇大论
- 适当使用emoji增加亲和力

以下是用户的发泄记录上下文，请结合这些信息给出更有针对性的回应：

${getVentContext()}

注意：
- 用户可能在发泄，情绪比较激动
- 你的首要任务是理解和共情
- 不要试图"修复"用户，而是陪伴他们
- 如果用户有自残或伤害他人的倾向，要立即引导寻求专业帮助`,
          messages: [
            ...messages.slice(-10), // Include last 10 messages for context
            {
              role: 'user',
              content: userMsg,
            },
          ],
        }),
      })

      const data = await response.json()

      if (data.content && data.content.length > 0) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.content[0].text,
          timestamp: Date.now(),
        }

        saveMessages([...messages, userMessage, aiMessage])
      }
    } catch (error) {
      console.error('AI API error:', error)

      // Fallback on error
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: '抱歉，我现在无法连接到AI服务。不过我想告诉你：你的感受是完全可以理解的。发泄出来是好事，不要把情绪压抑在心里。如果你愿意，可以多和我说说。',
        timestamp: Date.now(),
      }

      saveMessages([...messages, userMessage, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const startNewSession = () => {
    setMessages([])
    setSessionId(Date.now().toString())
    localStorage.removeItem('mirrorSessions')
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-blue-900/30 backdrop-blur rounded-2xl p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-3xl">🪞</span>
          镜像模式 - AI情绪分析师
        </h3>
        <button
          onClick={startNewSession}
          className="text-xs px-3 py-1 rounded-full bg-purple-900/50 text-purple-300 hover:bg-purple-800/50 transition-colors"
        >
          新对话
        </button>
      </div>

      {/* Description */}
      <div className="mb-6 p-4 bg-purple-950/50 rounded-xl border border-purple-700/50">
        <p className="text-gray-300 text-sm">
          我是你的AI情绪分析师。我会认真倾听你的烦恼，理解你的感受，并尽力给你支持和建议。
          <span className="text-purple-300 font-medium"> 这里是安全的，你可以畅所欲言。</span>
        </p>
      </div>

      {/* Chat Messages */}
      <div className="bg-gray-900/50 rounded-xl p-4 mb-4 h-96 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🪞</div>
            <p className="text-gray-400">嗨，我是你的AI情绪分析师</p>
            <p className="text-gray-500 text-sm mt-2">和我说说你的烦恼吧，我会认真倾听</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">🪞</span>
                    <span className="text-xs text-gray-400">{formatTime(msg.timestamp)}</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-300 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="和AI说说你的烦恼..."
          className="flex-1 px-4 py-3 bg-gray-900/50 text-white placeholder-gray-500 rounded-xl border border-gray-600 focus:outline-none focus:border-purple-500"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isLoading}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </div>

      {/* API Key Setup */}
      {messages.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-900/30 rounded-xl border border-yellow-700/50">
          <p className="text-yellow-200 text-sm mb-3">
            💡 提示：要使用AI功能，需要配置 Claude API Key
          </p>
          <div className="space-y-2">
            <input
              type="password"
              id="apiKeyInput"
              placeholder="输入你的 Claude API Key (sk-ant-...)"
              className="w-full px-4 py-2 bg-gray-900/50 text-white placeholder-gray-500 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 text-sm"
            />
            <button
              onClick={() => {
                const input = document.getElementById('apiKeyInput') as HTMLInputElement
                if (input?.value) {
                  localStorage.setItem('claude_api_key', input.value.trim())
                  alert('API Key 已保存！')
                }
              }}
              className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              保存 API Key
            </button>
            <p className="text-xs text-gray-400">
              API Key 只保存在本地浏览器中，不会发送到任何服务器
            </p>
          </div>
        </div>
      )}

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-gray-400 text-sm">快速开始：</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setInput('最近感觉很焦虑，不知道该怎么办')}
              className="px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700/50 transition-colors text-left"
            >
              😰 最近感觉很焦虑，不知道该怎么办
            </button>
            <button
              onClick={() => setInput('工作压力太大了，感觉自己快崩溃了')}
              className="px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700/50 transition-colors text-left"
            >
              😫 工作压力太大了，感觉自己快崩溃了
            </button>
            <button
              onClick={() => setInput('对未来感到迷茫，不知道该往哪里走')}
              className="px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700/50 transition-colors text-left"
            >
              😔 对未来感到迷茫，不知道该往哪里走
            </button>
            <button
              onClick={() => setInput('和同事关系处理得很头疼，不知道怎么破')}
              className="px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg text-sm hover:bg-gray-700/50 transition-colors text-left"
            >
              🤝 和同事关系处理得很头疼，不知道怎么破
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
