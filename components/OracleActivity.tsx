'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Activity messages that cycle randomly
const ACTIVITY_MESSAGES = [
  { type: 'analyze', text: 'Analyzing market sentiment patterns...' },
  { type: 'analyze', text: 'Processing probability matrices...' },
  { type: 'analyze', text: 'Scanning temporal data streams...' },
  { type: 'alert', text: 'Anomaly detected in prediction cluster #7' },
  { type: 'alert', text: 'Divergence threshold exceeded' },
  { type: 'update', text: 'Cloracle confidence recalibrated' },
  { type: 'update', text: 'Probability vectors updated' },
  { type: 'update', text: 'Market correlation adjusted' },
  { type: 'scan', text: 'Deep scanning political sector...' },
  { type: 'scan', text: 'Evaluating crypto volatility index...' },
  { type: 'scan', text: 'Cross-referencing historical patterns...' },
  { type: 'sync', text: 'Synchronizing with market feed...' },
  { type: 'sync', text: 'Neural pathways optimized' },
  { type: 'think', text: 'Contemplating alternate outcomes...' },
  { type: 'think', text: 'Weighing contrarian factors...' },
  { type: 'think', text: 'Evaluating black swan probability...' },
]

const STATUS_STATES = ['CALM', 'ALERT', 'ANALYZING', 'UNSTABLE'] as const
type StatusState = typeof STATUS_STATES[number]

interface ActivityItem {
  id: number
  type: string
  text: string
  timestamp: Date
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [idCounter, setIdCounter] = useState(0)

  useEffect(() => {
    // Add initial activities
    const initial = Array.from({ length: 3 }, (_, i) => ({
      id: i,
      ...ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)],
      timestamp: new Date(Date.now() - (2 - i) * 2000)
    }))
    setActivities(initial)
    setIdCounter(3)

    // Add new activity every 3-6 seconds
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        ...ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)],
        timestamp: new Date()
      }
      
      setActivities(prev => [newActivity, ...prev].slice(0, 5))
    }, 3000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'text-[#E63B30]'
      case 'analyze': return 'text-[#4ECDC4]'
      case 'update': return 'text-[#FF6B4A]'
      case 'scan': return 'text-[#9B59B6]'
      case 'sync': return 'text-[#3498DB]'
      case 'think': return 'text-[#1a1a2e]/60'
      default: return 'text-[#1a1a2e]'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert': return '⚠'
      case 'analyze': return '◈'
      case 'update': return '↻'
      case 'scan': return '◉'
      case 'sync': return '⟳'
      case 'think': return '◇'
      default: return '•'
    }
  }

  return (
    <div className="brutal-card p-4 bg-[#1a1a2e] text-white" style={{ fontFamily: 'var(--font-terminal), monospace' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm uppercase font-bold text-white/50">
          // LIVE AI ACTIVITY
        </h3>
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#4ECDC4] rounded-full animate-pulse" />
          <span className="text-sm text-[#4ECDC4]">ONLINE</span>
        </span>
      </div>
      
      <div className="space-y-2 text-lg" style={{ fontFamily: 'var(--font-terminal), monospace' }}>
        <AnimatePresence mode="popLayout">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-2 ${getTypeColor(activity.type)}`}
            >
              <span className="opacity-50">{getTypeIcon(activity.type)}</span>
              <span className="flex-1">{activity.text}</span>
              <span className="text-white/30 text-xs">
                {activity.timestamp.toLocaleTimeString('en-US', { 
                  hour12: false, 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function OracleStatus() {
  const [status, setStatus] = useState<StatusState>('CALM')
  const [confidence, setConfidence] = useState(87)
  const [thinking, setThinking] = useState(false)

  useEffect(() => {
    // Fluctuate confidence slightly
    const confidenceInterval = setInterval(() => {
      setConfidence(prev => {
        const change = (Math.random() - 0.5) * 4
        return Math.min(99, Math.max(60, prev + change))
      })
    }, 2000)

    // Change status occasionally
    const statusInterval = setInterval(() => {
      const rand = Math.random()
      if (rand < 0.6) setStatus('CALM')
      else if (rand < 0.8) setStatus('ANALYZING')
      else if (rand < 0.95) setStatus('ALERT')
      else setStatus('UNSTABLE')
    }, 5000)

    // Thinking animation
    const thinkInterval = setInterval(() => {
      setThinking(true)
      setTimeout(() => setThinking(false), 1500)
    }, 4000)

    return () => {
      clearInterval(confidenceInterval)
      clearInterval(statusInterval)
      clearInterval(thinkInterval)
    }
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'CALM': return 'bg-[#4ECDC4]'
      case 'ANALYZING': return 'bg-[#3498DB]'
      case 'ALERT': return 'bg-[#FF6B4A]'
      case 'UNSTABLE': return 'bg-[#E63B30]'
    }
  }

  return (
    <div className="brutal-card p-4" style={{ fontFamily: 'var(--font-terminal), monospace' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm uppercase font-bold text-[#1a1a2e]/50">
          // CLORACLE STATUS
        </h3>
        <div className={`px-2 py-1 text-sm font-bold text-white ${getStatusColor()}`}>
          {status}
        </div>
      </div>

      {/* Confidence meter */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>CONFIDENCE LEVEL</span>
          <span className="font-bold">{confidence.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-[#f0f0f0] border border-[#1a1a2e]">
          <motion.div 
            className="h-full bg-[#4ECDC4]"
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Thinking indicator */}
      <div className="flex items-center gap-2 text-sm text-[#1a1a2e]/60">
        <motion.span
          animate={{ opacity: thinking ? 1 : 0.3 }}
          className="text-[#4ECDC4]"
        >
          ◈
        </motion.span>
        <span>
          {thinking ? 'Cloracle is contemplating...' : 'You are observing the Cloracle'}
        </span>
      </div>
    </div>
  )
}

export function MarketVsOracle() {
  const [marketValue, setMarketValue] = useState(62)
  const [oracleValue, setOracleValue] = useState(78)
  const [divergence, setDivergence] = useState(16)

  useEffect(() => {
    const interval = setInterval(() => {
      const newMarket = marketValue + (Math.random() - 0.5) * 2
      const newOracle = oracleValue + (Math.random() - 0.5) * 1.5
      setMarketValue(Math.min(95, Math.max(30, newMarket)))
      setOracleValue(Math.min(95, Math.max(30, newOracle)))
      setDivergence(Math.abs(newOracle - newMarket))
    }, 3000)

    return () => clearInterval(interval)
  }, [marketValue, oracleValue])

  return (
    <div className="brutal-card p-4" style={{ fontFamily: 'var(--font-terminal), monospace' }}>
      <h3 className="text-sm uppercase font-bold text-[#1a1a2e]/50 mb-4">
        // MARKET vs CLORACLE
      </h3>

      <div className="space-y-3">
        {/* Market */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>MARKET CONSENSUS</span>
            <span>{marketValue.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-[#f0f0f0] border border-[#1a1a2e]">
            <motion.div 
              className="h-full bg-[#1a1a2e]"
              animate={{ width: `${marketValue}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Cloracle */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#E63B30]">CLORACLE PREDICTION</span>
            <span className="text-[#E63B30] font-bold">{oracleValue.toFixed(1)}%</span>
          </div>
          <div className="h-3 bg-[#f0f0f0] border border-[#E63B30]">
            <motion.div 
              className="h-full bg-[#E63B30]"
              animate={{ width: `${oracleValue}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Divergence */}
        <div className="pt-2 border-t border-[#1a1a2e]/20 flex justify-between items-center">
          <span className="text-sm">DIVERGENCE</span>
          <span className={`font-bold text-lg ${divergence > 10 ? 'text-[#E63B30]' : 'text-[#4ECDC4]'}`}>
            {divergence > 0 ? '+' : ''}{divergence.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export function ActionButtons() {
  const [loading, setLoading] = useState<string | null>(null)
  const [results, setResults] = useState<string | null>(null)

  const handleAction = (action: string) => {
    setLoading(action)
    setResults(null)
    
    // Simulate loading
    const duration = 2000 + Math.random() * 2000
    setTimeout(() => {
      setLoading(null)
      
      const messages: Record<string, string[]> = {
        'deep-scan': [
          'Deep scan complete. 3 anomalies detected.',
          'Scan finished. Market stability: 73%',
          'Analysis done. Confidence adjusted +2.3%'
        ],
        'temporal': [
          'Temporal projection: 67% probability in 30 days',
          'Future vector calculated. Uncertainty: medium',
          'Timeline analysis complete. 2 pivot points found.'
        ],
        'alternate': [
          'Alternate timeline: 45% divergence detected',
          '3 parallel outcomes calculated',
          'Multiverse scan: primary timeline stable'
        ]
      }
      
      const actionMessages = messages[action] || ['Analysis complete.']
      setResults(actionMessages[Math.floor(Math.random() * actionMessages.length)])
      
      setTimeout(() => setResults(null), 4000)
    }, duration)
  }

  return (
    <div className="brutal-card p-4" style={{ fontFamily: 'var(--font-terminal), monospace' }}>
      <h3 className="text-sm uppercase font-bold text-[#1a1a2e]/50 mb-4">
        // CLORACLE ACTIONS
      </h3>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <button
          onClick={() => handleAction('deep-scan')}
          disabled={loading !== null}
          className="brutal-button-blue text-sm py-2 px-2 disabled:opacity-50"
        >
          {loading === 'deep-scan' ? (
            <span className="animate-pulse">SCANNING...</span>
          ) : (
            'DEEP SCAN'
          )}
        </button>
        
        <button
          onClick={() => handleAction('temporal')}
          disabled={loading !== null}
          className="brutal-button-orange text-sm py-2 px-2 disabled:opacity-50"
        >
          {loading === 'temporal' ? (
            <span className="animate-pulse">PROJECTING...</span>
          ) : (
            'TEMPORAL'
          )}
        </button>
        
        <button
          onClick={() => handleAction('alternate')}
          disabled={loading !== null}
          className="brutal-button text-sm py-2 px-2 disabled:opacity-50"
        >
          {loading === 'alternate' ? (
            <span className="animate-pulse">CALCULATING...</span>
          ) : (
            'ALT TIMELINE'
          )}
        </button>
      </div>

      {/* Loading bar */}
      {loading && (
        <div className="mb-3">
          <div className="h-1 bg-[#f0f0f0] overflow-hidden">
            <motion.div
              className="h-full bg-[#4ECDC4]"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </div>
          <p className="text-sm text-[#1a1a2e]/50 mt-1 animate-pulse">
            Cloracle is processing...
          </p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-2 bg-[#4ECDC4]/10 border border-[#4ECDC4] text-sm"
          >
            <span className="text-[#4ECDC4]">◈</span> {results}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function AutoStatusText() {
  const [text, setText] = useState('')
  const messages = [
    'Cloracle is analyzing market patterns...',
    'You are observing the Cloracle',
    'Neural pathways active',
    'Contemplating probability space...',
    'Monitoring prediction drift...',
    'Autonomous analysis in progress',
    'Cloracle confidence stable',
    'Scanning for market anomalies...',
  ]

  useEffect(() => {
    setText(messages[0])
    const interval = setInterval(() => {
      setText(messages[Math.floor(Math.random() * messages.length)])
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      key={text}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center text-sm text-[#1a1a2e]/50 py-2"
      style={{ fontFamily: 'var(--font-terminal), monospace' }}
    >
      <span className="text-[#4ECDC4]">◈</span> {text}
    </motion.div>
  )
}
