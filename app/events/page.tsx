'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { EventCard } from '@/components/EventCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import Link from 'next/link'
import Image from 'next/image'

interface Event {
  id: string
  slug: string
  title: string
  description: string
  category: string
  imageUrl: string | null
  marketProb: number
  cloracleProb: number | null
  confidence: string | null
  endDate: string | null
}

const CATEGORIES = ['Politics', 'Crypto', 'Sports', 'Pop Culture', 'Business', 'Science', 'Other']

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [autoAnalyzing, setAutoAnalyzing] = useState(false)
  const [analyzeProgress, setAnalyzeProgress] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [syncStatus, setSyncStatus] = useState<{ totalEvents: number; analyzedEvents: number } | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory)
      }
      params.set('limit', '100')
      
      const response = await fetch(`/api/events?${params}`)
      const data = await response.json()
      setEvents(data.events || [])
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory])

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync')
      const data = await response.json()
      setSyncStatus(data)
    } catch (error) {
      console.error('Failed to fetch sync status:', error)
    }
  }

  useEffect(() => {
    fetchEvents()
    fetchSyncStatus()
  }, [fetchEvents])

  const handleSync = async () => {
    setSyncing(true)
    try {
      await fetch('/api/sync', { method: 'POST' })
      await fetchEvents()
      await fetchSyncStatus()
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setSyncing(false)
    }
  }

  const handleAutoAnalyze = async () => {
    setAutoAnalyzing(true)
    setAnalyzeProgress('Starting auto-analysis...')
    try {
      const response = await fetch('/api/analyze-all', { method: 'POST' })
      const data = await response.json()
      setAnalyzeProgress(`Analyzed ${data.analyzed} events`)
      await fetchEvents()
      await fetchSyncStatus()
      
      if (data.analyzed > 0 && data.analyzed < data.total) {
        setTimeout(() => handleAutoAnalyze(), 1000)
      } else {
        setTimeout(() => setAnalyzeProgress(null), 3000)
      }
    } catch (error) {
      console.error('Auto-analyze failed:', error)
      setAnalyzeProgress('Analysis failed')
      setTimeout(() => setAnalyzeProgress(null), 3000)
    } finally {
      setAutoAnalyzing(false)
    }
  }

  const handleAnalyze = async (eventId: string) => {
    setAnalyzing(eventId)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      })
      const data = await response.json()
      
      if (data.event) {
        setEvents(prev => prev.map(e => 
          e.id === eventId ? { ...e, ...data.event } : e
        ))
      }
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setAnalyzing(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-terminal), monospace' }}>
      {/* Header */}
      <header className="header-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/oracle.png" alt="Cloracle" width={32} height={32} className="w-8 h-8" />
              <span className="font-black text-lg">CLORACLE</span>
            </Link>

            <nav className="flex items-center gap-3">
              {analyzeProgress && (
                <span className="text-xs text-blue font-semibold animate-pulse">
                  {analyzeProgress}
                </span>
              )}
              <Link href="/" className="brutal-button">
                ← Home
              </Link>
              <Link href="/chat" className="brutal-button-orange">
                Chat
              </Link>
              <button
                onClick={handleAutoAnalyze}
                disabled={autoAnalyzing}
                className="brutal-button-blue disabled:opacity-50"
              >
                {autoAnalyzing ? 'Analyzing...' : 'Auto Analyze'}
              </button>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="brutal-button disabled:opacity-50"
              >
                {syncing ? 'Syncing...' : 'Sync'}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        {/* Section Title */}
        <h1 
          className="text-3xl md:text-4xl text-[#E63B30] mb-2"
          style={{ fontFamily: 'var(--font-pixel), monospace' }}
        >
          EVENTS TERMINAL
        </h1>
        <p className="text-[#1a1a2e]/50 mb-6">Browse and analyze prediction market events</p>

        {/* Stats */}
        {syncStatus && (
          <div className="flex gap-6 mb-6 text-sm">
            <div>
              <span className="text-[#1a1a2e]/50">Total Events:</span>{' '}
              <span className="font-bold text-[#4ECDC4]">{syncStatus.totalEvents}</span>
            </div>
            <div>
              <span className="text-[#1a1a2e]/50">Analyzed:</span>{' '}
              <span className="font-bold text-[#E63B30]">{syncStatus.analyzedEvents}</span>
            </div>
          </div>
        )}
        
        {/* Filters */}
        <div className="mb-8">
          <CategoryFilter
            categories={CATEGORIES}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20">
            <Image src="/oracle.png" alt="Loading" width={64} height={64} className="w-16 h-16 mx-auto animate-pulse" />
            <p className="uppercase text-dark/50 text-sm mt-4">Loading...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 brutal-card p-12">
            <Image src="/oracle.png" alt="No events" width={80} height={80} className="w-20 h-20 mx-auto mb-4" />
            <h3 className="font-black uppercase mb-2">No Events</h3>
            <p className="text-dark/50 text-sm mb-6">
              {selectedCategory !== 'all' 
                ? `No events in ${selectedCategory}.` 
                : 'Click Sync to fetch from Polymarket.'}
            </p>
            {selectedCategory === 'all' && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="brutal-button-blue"
              >
                {syncing ? 'Syncing...' : 'Sync Events'}
              </button>
            )}
          </div>
        ) : selectedCategory !== 'all' ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
          >
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              >
                <EventCard
                  id={event.id}
                  slug={event.slug}
                  title={event.title}
                  description={event.description}
                  category={event.category}
                  marketProb={event.marketProb}
                  cloracleProb={event.cloracleProb}
                  confidence={event.confidence}
                  endDate={event.endDate ? new Date(event.endDate) : null}
                  onAnalyze={() => handleAnalyze(event.id)}
                  isAnalyzing={analyzing === event.id}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="space-y-12">
            {CATEGORIES.map((category) => {
              const categoryEvents = events.filter(e => 
                e.category.toLowerCase() === category.toLowerCase()
              )
              
              if (categoryEvents.length === 0) return null
              
              return (
                <section key={category}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-black uppercase">{category}</h2>
                    <div className="flex-1 h-[2px] bg-[#1a1a2e]" />
                    <span className="brutal-tag brutal-tag-blue">
                      {categoryEvents.length} events
                    </span>
                  </div>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    initial="hidden"
                    animate="show"
                    variants={{
                      hidden: { opacity: 0 },
                      show: { opacity: 1, transition: { staggerChildren: 0.05 } }
                    }}
                  >
                    {categoryEvents.slice(0, 6).map((event, index) => (
                      <motion.div
                        key={event.id}
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                      >
                        <EventCard
                          id={event.id}
                          slug={event.slug}
                          title={event.title}
                          description={event.description}
                          category={event.category}
                          marketProb={event.marketProb}
                          cloracleProb={event.cloracleProb}
                          confidence={event.confidence}
                          endDate={event.endDate ? new Date(event.endDate) : null}
                          onAnalyze={() => handleAnalyze(event.id)}
                          isAnalyzing={analyzing === event.id}
                          index={index}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  {categoryEvents.length > 6 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className="brutal-button"
                      >
                        View all {categoryEvents.length} {category} events →
                      </button>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="header-border py-8 mt-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src="/oracle.png" alt="Cloracle" width={24} height={24} className="w-6 h-6" />
              <span className="font-bold text-sm">CLORACLE</span>
            </div>
            <span className="text-xs text-dark/50 uppercase">
              Data from Polymarket. Not financial advice.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
