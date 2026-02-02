'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const LOADING_MESSAGES = [
  'INITIALIZING NEURAL NETWORK...',
  'CONNECTING TO POLYMARKET...',
  'CALIBRATING PREDICTION ENGINE...',
  'LOADING PROBABILITY MATRIX...',
  'SYNCING MARKET DATA...',
  'ANALYZING SENTIMENT PATTERNS...',
  'ESTABLISHING SECURE CONNECTION...',
  'PROCESSING HISTORICAL DATA...',
  'WARMING UP AI CORES...',
  'DECRYPTING MARKET SIGNALS...',
]

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?0123456789ABCDEF'

function generateGlitchText(length: number) {
  return Array.from({ length }, () => 
    GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
  ).join('')
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState(LOADING_MESSAGES[0])
  const [glitchText, setGlitchText] = useState('')
  const [hexValues, setHexValues] = useState<string[]>([])

  // Chaotic progress bar
  useEffect(() => {
    const startTime = Date.now()
    const duration = 5000 // 5 seconds

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const baseProgress = (elapsed / duration) * 100
      
      // Add chaotic jumps
      const chaos = Math.sin(elapsed / 200) * 5 + Math.random() * 8 - 4
      const newProgress = Math.min(Math.max(baseProgress + chaos, 0), elapsed >= duration ? 100 : 95)
      
      setProgress(newProgress)

      if (elapsed >= duration) {
        clearInterval(interval)
        setProgress(100)
        setTimeout(onComplete, 300)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [onComplete])

  // Rotating messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)])
    }, 800)
    return () => clearInterval(interval)
  }, [])

  // Glitch text effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(generateGlitchText(32))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Hex values stream
  useEffect(() => {
    const interval = setInterval(() => {
      setHexValues(prev => {
        const newVal = `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`
        return [...prev.slice(-5), newVal]
      })
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Grid background like main site */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(78, 205, 196, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(78, 205, 196, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 107, 74, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 74, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Floating hex values */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {hexValues.map((hex, i) => (
            <motion.div
              key={`${hex}-${i}`}
              className="absolute text-[#4ECDC4]/40 font-mono text-xs"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: -20,
                opacity: 0 
              }}
              animate={{ 
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20,
                opacity: [0, 0.6, 0]
              }}
              transition={{ duration: 3, ease: 'linear' }}
            >
              {hex}
            </motion.div>
          ))}
        </div>

        {/* Glitch text top */}
        <div className="absolute top-8 left-8 text-[#4ECDC4]/50 font-mono text-xs">
          {glitchText}
        </div>
        <div className="absolute top-8 right-8 text-[#FF6B4A]/50 font-mono text-xs">
          {glitchText.split('').reverse().join('')}
        </div>

        {/* Main content */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Oracle image with pulsing glow */}
          <motion.div
            className="relative mb-8"
            animate={{
              scale: [1, 1.05, 1],
              filter: [
                'drop-shadow(0 0 30px rgba(78, 205, 196, 0.6))',
                'drop-shadow(0 0 50px rgba(255, 107, 74, 0.6))',
                'drop-shadow(0 0 30px rgba(78, 205, 196, 0.6))',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/oracle.png"
              alt="Cloracle"
              width={150}
              height={150}
              className="w-32 h-32 md:w-40 md:h-40"
              style={{ imageRendering: 'pixelated' }}
            />
            
            {/* Rotating ring */}
            <motion.div
              className="absolute inset-0 border-2 border-[#4ECDC4] rounded-full"
              style={{ margin: '-10px' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-0 border-2 border-[#FF6B4A]/50 rounded-full"
              style={{ margin: '-20px' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl text-[#E63B30] mb-4"
            style={{ fontFamily: 'var(--font-pixel), monospace' }}
            animate={{
              textShadow: [
                '0 0 10px rgba(230, 59, 48, 0.5)',
                '2px 0 10px rgba(78, 205, 196, 0.5)',
                '-2px 0 10px rgba(230, 59, 48, 0.5)',
                '0 0 10px rgba(230, 59, 48, 0.5)',
              ]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            CLORACLE
          </motion.h1>

          {/* Loading message */}
          <motion.p
            className="text-[#1a1a2e] font-mono text-sm mb-8 h-6"
            style={{ fontFamily: 'var(--font-terminal), monospace' }}
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {message}
          </motion.p>

          {/* Progress bar */}
          <div className="w-64 md:w-80 h-3 bg-white border border-[#1a1a2e] relative overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E63B30] via-[#FF6B4A] to-[#4ECDC4]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
            {/* Glitch effect on progress */}
            <motion.div
              className="absolute inset-0 bg-[#4ECDC4]/30"
              animate={{ 
                x: [-100, 100],
                opacity: [0, 0.5, 0]
              }}
              transition={{ duration: 0.3, repeat: Infinity }}
            />
          </div>

          {/* Progress percentage */}
          <div className="flex justify-between w-64 md:w-80 mt-2 font-mono text-xs">
            <span className="text-[#1a1a2e]/50">LOADING</span>
            <span className="text-[#E63B30] font-bold">{Math.floor(progress)}%</span>
          </div>

          {/* Fake system info */}
          <div className="mt-8 font-mono text-xs text-[#1a1a2e]/50 text-center space-y-1">
            <div>SYS::KERNEL v2.0.26 | MEM::OK | NET::STABLE</div>
            <div>AI_ENGINE::MOLT_BOT | STATUS::INITIALIZING</div>
          </div>
        </div>

        {/* Bottom glitch text */}
        <div className="absolute bottom-8 left-0 right-0 text-center text-[#4ECDC4]/30 font-mono text-xs overflow-hidden">
          <motion.div
            animate={{ x: [-500, 500] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            {Array(10).fill(glitchText).join(' :: ')}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
