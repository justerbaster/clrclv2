'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  eventId?: string
  eventTitle?: string
  initialMessage?: string | null
  onMessageSent?: () => void
}

export function ChatInterface({ eventId, eventTitle, initialMessage, onMessageSent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle initial message from props
  useEffect(() => {
    if (initialMessage && !isLoading) {
      setInput(initialMessage)
    }
  }, [initialMessage])

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    onMessageSent?.()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, eventId })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || 'Error processing request.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-white" style={{ fontFamily: 'var(--font-terminal), monospace' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#fafafa]">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Image src="/oracle.png" alt="Cloracle" width={64} height={64} className="w-16 h-16 mx-auto mb-4" />
            <div className="text-lg text-[#1a1a2e]/70 mb-2">
              Ask the Cloracle
            </div>
            <p className="text-sm text-[#1a1a2e]/40 max-w-md mx-auto">
              Get probability estimates, market analysis, and predictions for any event.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <Image src="/oracle.png" alt="Cloracle" width={32} height={32} className="w-8 h-8 mr-2 flex-shrink-0" />
            )}
            <div
              className={`max-w-[80%] px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-[#4ECDC4] text-white'
                  : 'bg-white border border-[#1a1a2e]'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/60' : 'text-[#1a1a2e]/40'}`}>
                {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Image src="/oracle.png" alt="Cloracle" width={32} height={32} className="w-8 h-8 mr-2" />
            <div className="bg-white border border-[#1a1a2e] px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-[#E63B30]">
                <span className="animate-pulse">◈</span>
                <span>Cloracle is analyzing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#1a1a2e] bg-white">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about predictions, probabilities, market trends..."
            className="brutal-input flex-1"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="brutal-button-orange px-6 disabled:opacity-50"
          >
            {isLoading ? '...' : 'ASK'}
          </button>
        </div>
      </div>
    </div>
  )
}
