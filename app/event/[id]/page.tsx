'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChatInterface } from '@/components/ChatInterface'

interface Event {
  id: string
  title: string
  description: string
  category: string
  marketProb: number
  cloracleProb: number | null
  cloracleReason: string | null
  confidence: string | null
  endDate: string | null
  analyzedAt: string | null
  predictions: { id: string; probability: number; confidence: string; createdAt: string }[]
}

export default function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${encodeURIComponent(id)}`)
        if (response.ok) setEvent(await response.json())
      } catch (error) {
        console.error('Failed:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  const handleAnalyze = async () => {
    if (!event) return
    setAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id })
      })
      const data = await response.json()
      if (data.event) setEvent(prev => prev ? { ...prev, ...data.event } : null)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Image src="/oracle.png" alt="Loading" width={64} height={64} className="w-16 h-16 mx-auto animate-pulse" />
          <p className="uppercase text-xs text-[#1a1a2e]/50 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center brutal-card p-8">
          <Image src="/oracle.png" alt="Not found" width={64} height={64} className="w-16 h-16 mx-auto mb-4" />
          <h2 className="font-black uppercase mb-4 text-orange">Not Found</h2>
          <Link href="/" className="brutal-button-blue">← Back</Link>
        </div>
      </div>
    )
  }

  const marketPct = Math.round(event.marketProb * 100)
  const cloraclePct = event.cloracleProb !== null ? Math.round(event.cloracleProb * 100) : null
  const difference = cloraclePct !== null ? cloraclePct - marketPct : null

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/oracle.png" alt="Cloracle" width={32} height={32} className="w-8 h-8" />
              <span className="font-black text-lg">CLORACLE</span>
            </Link>
            <Link href="/" className="brutal-button">← Back</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Event Info */}
            <div className="brutal-card p-6 bg-white">
              <div className="flex gap-2 mb-4">
                <span className="brutal-tag brutal-tag-blue">■ {event.category}</span>
                {event.confidence && <span className="brutal-tag brutal-tag-orange">■ {event.confidence}</span>}
              </div>

              <h1 className="font-black text-2xl leading-tight mb-4">
                {event.title}
              </h1>

              <p className="text-[#1a1a2e]/70">{event.description}</p>

              {event.endDate && (
                <div className="text-xs text-[#1a1a2e]/50 uppercase mt-4 font-semibold">
                  Ends: {new Date(event.endDate).toLocaleDateString()}
                </div>
              )}
            </div>

            {/* Probabilities */}
            <div className="brutal-card p-6 bg-white">
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-6xl font-black text-blue">{marketPct}%</div>
                  <div className="text-xs uppercase text-[#1a1a2e]/50 mt-2 font-semibold">Market</div>
                </div>
                <div className="text-center">
                  <div className="text-6xl font-black text-orange">{cloraclePct ?? '—'}{cloraclePct !== null && '%'}</div>
                  <div className="text-xs uppercase text-[#1a1a2e]/50 mt-2 font-semibold">Cloracle</div>
                </div>
              </div>

              {/* Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs uppercase mb-2 font-semibold">
                    <span>Market</span>
                    <span>{marketPct}%</span>
                  </div>
                  <div className="brutal-progress h-3">
                    <div className="brutal-progress-fill-blue h-full" style={{ width: `${marketPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs uppercase mb-2 font-semibold text-orange">
                    <span>Cloracle</span>
                    <span>{cloraclePct ?? '—'}{cloraclePct !== null && '%'}</span>
                  </div>
                  <div className="brutal-progress h-3">
                    <div className="brutal-progress-fill h-full" style={{ width: `${cloraclePct ?? 0}%` }} />
                  </div>
                </div>
              </div>

              {difference !== null && (
                <div className="mt-8 pt-6 border-t-2 border-[#1a1a2e] text-center">
                  <div className="text-xs uppercase text-[#1a1a2e]/50 mb-2 font-semibold">Divergence</div>
                  <div className={`text-4xl font-black ${Math.abs(difference) >= 10 ? 'text-orange' : ''}`}>
                    {difference > 0 ? '+' : ''}{difference}%
                  </div>
                </div>
              )}

              {!event.cloracleProb && (
                <div className="mt-8 pt-6 border-t-2 border-[#1a1a2e] text-center">
                  <button onClick={handleAnalyze} disabled={analyzing} className="brutal-button-orange disabled:opacity-50">
                    {analyzing ? 'Analyzing...' : 'Get Cloracle Analysis'}
                  </button>
                </div>
              )}
            </div>

            {/* Reasoning */}
            {event.cloracleReason && (
              <div className="brutal-card p-6 bg-white">
                <div className="flex items-center gap-2 mb-4">
                  <Image src="/oracle.png" alt="Cloracle" width={24} height={24} className="w-6 h-6" />
                  <span className="text-xs uppercase text-[#1a1a2e]/50 font-bold">Cloracle Analysis</span>
                </div>
                <div className="text-[#1a1a2e]/80 leading-relaxed whitespace-pre-wrap">
                  {event.cloracleReason}
                </div>
              </div>
            )}
          </div>

          {/* Chat */}
          <div className="lg:col-span-1">
            <button onClick={() => setShowChat(!showChat)} className="lg:hidden w-full brutal-button mb-4">
                  {showChat ? 'Hide Terminal' : 'Ask Cloracle'}
            </button>
            <div className={`${showChat ? 'block' : 'hidden'} lg:block h-[550px]`}>
              <ChatInterface eventId={event.id} eventTitle={event.title} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
