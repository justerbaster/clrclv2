'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChatInterface } from '@/components/ChatInterface'

const EXAMPLE_QUESTIONS = [
  "What's the probability of Bitcoin reaching $100k?",
  "Analyze the 2026 US elections",
  "Will there be a recession this year?",
  "SpaceX Mars landing probability?",
  "Crypto market outlook for 2026"
]

export default function ChatPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-terminal), monospace' }}>
      {/* Header */}
      <header className="header-border bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/oracle.png" alt="Cloracle" width={32} height={32} className="w-8 h-8" />
              <span className="font-black text-lg">CLORACLE</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#4ECDC4]">◈ CLORACLE ONLINE</span>
              <Link href="/" className="brutal-button">← Back</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="brutal-card p-4 bg-[#1a1a2e] text-white">
              <div className="flex items-center gap-2 mb-3">
                <Image src="/oracle.png" alt="Cloracle" width={40} height={40} className="w-10 h-10" />
                <div>
                  <h2 className="font-black text-sm">CLORACLE AI</h2>
                  <span className="text-xs text-[#4ECDC4]">Prediction Cloracle</span>
                </div>
              </div>
              <p className="text-xs text-white/60">
                Ask questions about events, get probability estimates, and receive detailed analysis.
              </p>
            </div>

            <div className="brutal-card p-4">
              <h3 className="text-xs uppercase font-bold text-[#1a1a2e]/50 mb-3">
                // EXAMPLE QUESTIONS
              </h3>
              <div className="space-y-2">
                {EXAMPLE_QUESTIONS.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedQuestion(question)}
                    className="w-full text-left p-2 text-sm border border-[#1a1a2e]/20 hover:border-[#4ECDC4] hover:bg-[#4ECDC4]/5 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="brutal-card p-4 bg-[#E63B30]/5 border-[#E63B30]">
              <h3 className="text-xs uppercase font-bold text-[#E63B30] mb-2">
                // CAPABILITIES
              </h3>
              <ul className="text-xs space-y-1 text-[#1a1a2e]/70">
                <li>◈ Probability estimates</li>
                <li>◈ Market analysis</li>
                <li>◈ Event predictions</li>
                <li>◈ Risk assessment</li>
                <li>◈ Trend detection</li>
              </ul>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <div className="brutal-card flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-[#1a1a2e] flex items-center justify-between bg-[#f8f8f8]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-pulse" />
                  <span className="text-sm font-bold">CLORACLE CHAT</span>
                </div>
                <span className="text-xs text-[#1a1a2e]/50">Powered by Molt Bot</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatInterface initialMessage={selectedQuestion} onMessageSent={() => setSelectedQuestion(null)} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
