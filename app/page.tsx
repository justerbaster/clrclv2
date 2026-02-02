'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FullTerminalDashboard } from '@/components/TerminalDashboard'
import { LoadingScreen } from '@/components/LoadingScreen'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      <motion.div 
        className="min-h-screen" 
        style={{ fontFamily: 'var(--font-terminal), monospace' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
      {/* Header */}
      <header className="header-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/oracle.png" alt="Cloracle" width={32} height={32} className="w-8 h-8" />
              <span className="font-black text-lg">CLORACLE</span>
            </Link>

            <nav className="flex items-center gap-3">
              <Link href="/docs" className="brutal-button">
                Docs
              </Link>
              <Link href="/events" className="brutal-button">
                Events
              </Link>
              <Link href="/chat" className="brutal-button-orange">
                Chat
              </Link>
              <a
                href="https://x.com/cloracleAI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center border border-[#1a1a2e] hover:bg-[#1a1a2e] hover:text-white transition-all"
                style={{ fontFamily: 'var(--font-pixel), monospace' }}
              >
                X
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="header-border bg-white overflow-hidden relative">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute top-0 left-0 min-w-full min-h-full w-auto h-auto object-cover"
            style={{ 
              filter: 'blur(4px)', 
              transform: 'scale(1.1)'
            }}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10">
          {/* Title with pixel glitch animation */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 
              className="pixel-headline text-red pixel-glitch"
              data-text="CLORACLE"
            >
              {'CLORACLE'.split('').map((letter, index) => (
                <span
                  key={index}
                  className="pixel-letter"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {letter}
                </span>
              ))}
            </h1>
          </motion.div>
          
          {/* Cloracle Image */}
          <motion.div 
            className="flex justify-center my-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "backOut" }}
          >
            <Image 
              src="/oracle.png" 
              alt="Cloracle Oracle" 
              width={200} 
              height={200}
              className="w-44 h-44 lg:w-52 lg:h-52"
            />
          </motion.div>

          <motion.p 
            className="text-lg text-center max-w-lg mx-auto text-dark/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            AI Prediction Cloracle. Analyzing prediction markets with artificial intelligence. <a 
              href="https://openclaw.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E63B30] hover:text-[#4ECDC4] transition-colors"
            >powered by moltbot 🦞</a>
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="flex justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <Link 
              href="/events" 
              className="brutal-button-blue px-8 py-3 text-lg"
              style={{ fontFamily: 'var(--font-pixel), monospace' }}
            >
              OPEN TERMINAL
            </Link>
            <Link 
              href="/chat" 
              className="brutal-button-orange px-8 py-3 text-lg"
              style={{ fontFamily: 'var(--font-pixel), monospace' }}
            >
              CHAT
            </Link>
          </motion.div>

        </div>
      </section>

      {/* Cloracle Terminal Dashboard */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <h2 
          className="text-xl text-[#4ECDC4] mb-4"
          style={{ fontFamily: 'var(--font-pixel), monospace' }}
        >
          LIVE TERMINAL
        </h2>
        <FullTerminalDashboard />
      </section>

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
    </motion.div>
    </>
  )
}
