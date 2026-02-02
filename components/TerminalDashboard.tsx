'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Fake data streams
const DATA_STREAMS = [
  'POLYMARKET::SYNC',
  'PROB_MATRIX::CALC',
  'SENTIMENT::SCAN',
  'DIVERGENCE::CHECK',
  'NEURAL::PROCESS',
  'MARKET::FETCH',
  'TREND::ANALYZE',
  'RISK::EVALUATE',
]

const SECTORS = ['POLITICS', 'CRYPTO', 'SPORTS', 'BUSINESS', 'SCIENCE']

function generateHex() {
  return Math.random().toString(16).substring(2, 10).toUpperCase()
}

function generateRandomPercent() {
  return (Math.random() * 100).toFixed(2)
}

export function TerminalHeader() {
  const [time, setTime] = useState(new Date())
  const [blinkOn, setBlinkOn] = useState(true)

  useEffect(() => {
    const timeInterval = setInterval(() => setTime(new Date()), 1000)
    const blinkInterval = setInterval(() => setBlinkOn(prev => !prev), 500)
    return () => {
      clearInterval(timeInterval)
      clearInterval(blinkInterval)
    }
  }, [])

  return (
    <div className="bg-[#0a0a0a] text-[#4ECDC4] p-3 border-b border-[#4ECDC4]/30 flex justify-between items-center font-mono text-xs">
      <div className="flex items-center gap-4">
        <span className="text-[#E63B30]">■</span>
        <span>CLORACLE TERMINAL v2.0.26</span>
        <span className="text-[#4ECDC4]/50">|</span>
        <span>SESSION: {generateHex()}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className={blinkOn ? 'text-[#4ECDC4]' : 'text-[#4ECDC4]/30'}>●</span>
        <span>LIVE</span>
        <span className="text-[#4ECDC4]/50">|</span>
        <span>{time.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Los_Angeles' })} PT</span>
      </div>
    </div>
  )
}

export function DataStream() {
  const [streams, setStreams] = useState<Array<{ id: number; text: string; value: string }>>([])

  useEffect(() => {
    const addStream = () => {
      const newStream = {
        id: Date.now(),
        text: DATA_STREAMS[Math.floor(Math.random() * DATA_STREAMS.length)],
        value: `0x${generateHex()}`
      }
      setStreams(prev => [...prev.slice(-8), newStream])
    }

    addStream()
    const interval = setInterval(addStream, 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0a0a0a] p-3 h-32 overflow-hidden font-mono text-xs">
      <AnimatePresence mode="popLayout">
        {streams.map((stream) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-2 text-[#4ECDC4]/70"
          >
            <span className="text-[#4ECDC4]/30">&gt;</span>
            <span className="text-[#FF6B4A]">{stream.text}</span>
            <span className="text-[#4ECDC4]/50">::</span>
            <span>{stream.value}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function SectorMonitor() {
  const [sectorData, setSectorData] = useState<Record<string, { prob: number; trend: string; status: string }>>({})

  useEffect(() => {
    const updateSectors = () => {
      const newData: Record<string, { prob: number; trend: string; status: string }> = {}
      SECTORS.forEach(sector => {
        newData[sector] = {
          prob: 40 + Math.random() * 50,
          trend: Math.random() > 0.5 ? '↑' : '↓',
          status: Math.random() > 0.8 ? 'ALERT' : Math.random() > 0.5 ? 'ACTIVE' : 'STABLE'
        }
      })
      setSectorData(newData)
    }

    updateSectors()
    const interval = setInterval(updateSectors, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0a0a0a] p-3 font-mono text-xs">
      <div className="text-[#4ECDC4]/50 mb-2">// SECTOR MONITOR</div>
      <div className="space-y-1">
        {SECTORS.map(sector => {
          const data = sectorData[sector]
          if (!data) return null
          return (
            <div key={sector} className="flex justify-between items-center">
              <span className="text-[#4ECDC4]">{sector}</span>
              <div className="flex items-center gap-3">
                <span className={data.trend === '↑' ? 'text-[#4ECDC4]' : 'text-[#E63B30]'}>
                  {data.trend} {data.prob.toFixed(1)}%
                </span>
                <span className={`text-xs px-1 ${
                  data.status === 'ALERT' ? 'bg-[#E63B30] text-white' :
                  data.status === 'ACTIVE' ? 'bg-[#4ECDC4]/20 text-[#4ECDC4]' :
                  'text-[#4ECDC4]/50'
                }`}>
                  {data.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function ProbabilityMatrix() {
  const [matrix, setMatrix] = useState<string[][]>([])

  useEffect(() => {
    const generateMatrix = () => {
      const newMatrix: string[][] = []
      for (let i = 0; i < 4; i++) {
        const row: string[] = []
        for (let j = 0; j < 8; j++) {
          row.push((Math.random() * 100).toFixed(0).padStart(2, '0'))
        }
        newMatrix.push(row)
      }
      setMatrix(newMatrix)
    }

    generateMatrix()
    const interval = setInterval(generateMatrix, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0a0a0a] p-3 font-mono text-[10px]">
      <div className="text-[#4ECDC4]/50 mb-2">// PROBABILITY MATRIX</div>
      <div className="space-y-1">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-2">
            {row.map((val, j) => (
              <span 
                key={j} 
                className={parseInt(val) > 70 ? 'text-[#E63B30]' : parseInt(val) > 40 ? 'text-[#FF6B4A]' : 'text-[#4ECDC4]/60'}
              >
                {val}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function AlertTicker() {
  const [alerts, setAlerts] = useState<string[]>([])
  
  const ALERT_MESSAGES = [
    'DIVERGENCE DETECTED: POLITICS SECTOR +12.3%',
    'NEW EVENT: CRYPTO MARKET UPDATE',
    'CONFIDENCE RECALIBRATED: 87.2%',
    'ANOMALY SCAN COMPLETE: 3 FINDINGS',
    'MARKET SYNC: 100 EVENTS PROCESSED',
    'TREND SHIFT: SPORTS SECTOR',
    'HIGH VOLATILITY: BUSINESS SECTOR',
    'PREDICTION UPDATE: EVENT #7829',
  ]

  useEffect(() => {
    const addAlert = () => {
      setAlerts(prev => [
        ALERT_MESSAGES[Math.floor(Math.random() * ALERT_MESSAGES.length)],
        ...prev.slice(0, 2)
      ])
    }
    addAlert()
    const interval = setInterval(addAlert, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#E63B30]/10 border-l-2 border-[#E63B30] p-2 font-mono text-xs">
      <AnimatePresence mode="popLayout">
        {alerts.map((alert, i) => (
          <motion.div
            key={`${alert}-${i}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0 }}
            className={`text-[#E63B30] ${i > 0 ? 'opacity-50' : ''}`}
          >
            ⚠ {alert}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function CommandLine() {
  const [command, setCommand] = useState('')
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setCursor(prev => !prev), 530)
    return () => clearInterval(interval)
  }, [])

  const commands = [
    'analyze --sector=all --depth=full',
    'scan --anomalies --threshold=0.15',
    'predict --event=latest --confidence=high',
    'sync --source=polymarket --limit=100',
    'status --verbose',
  ]

  useEffect(() => {
    let currentCmd = 0
    let charIndex = 0
    
    const typeCommand = () => {
      const cmd = commands[currentCmd]
      if (charIndex <= cmd.length) {
        setCommand(cmd.substring(0, charIndex))
        charIndex++
      } else {
        setTimeout(() => {
          setCommand('')
          charIndex = 0
          currentCmd = (currentCmd + 1) % commands.length
        }, 2000)
      }
    }

    const interval = setInterval(typeCommand, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-[#0a0a0a] p-3 font-mono text-sm border-t border-[#4ECDC4]/30">
      <span className="text-[#4ECDC4]">cloracle@terminal</span>
      <span className="text-white">:</span>
      <span className="text-[#FF6B4A]">~</span>
      <span className="text-white">$ </span>
      <span className="text-[#4ECDC4]">{command}</span>
      <span className={`${cursor ? 'opacity-100' : 'opacity-0'} text-[#4ECDC4]`}>█</span>
    </div>
  )
}

export function ScanLines() {
  return (
    <div 
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.03) 2px,
          rgba(0,0,0,0.03) 4px
        )`,
      }}
    />
  )
}

export function FullTerminalDashboard() {
  return (
    <div className="brutal-card overflow-hidden relative bg-[#0a0a0a]">
      <ScanLines />
      <TerminalHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-[#4ECDC4]/20">
        <div className="border-r border-[#4ECDC4]/20">
          <DataStream />
          <div className="border-t border-[#4ECDC4]/20">
            <ProbabilityMatrix />
          </div>
        </div>
        <div className="border-r border-[#4ECDC4]/20">
          <SectorMonitor />
          <div className="border-t border-[#4ECDC4]/20 p-3">
            <AlertTicker />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex-1 p-3 bg-[#0a0a0a]">
            <div className="text-[#4ECDC4]/50 text-xs mb-2 font-mono">// SYSTEM STATUS</div>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-[#4ECDC4]/70">NEURAL NETWORK</span>
                <span className="text-[#4ECDC4]">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4ECDC4]/70">MARKET FEED</span>
                <span className="text-[#4ECDC4]">CONNECTED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4ECDC4]/70">ANALYSIS ENGINE</span>
                <span className="text-[#FF6B4A]">PROCESSING</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4ECDC4]/70">PREDICTION MODEL</span>
                <span className="text-[#4ECDC4]">CALIBRATED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4ECDC4]/70">CONFIDENCE</span>
                <span className="text-[#E63B30]">87.3%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommandLine />
    </div>
  )
}
