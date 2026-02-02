'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const SECTIONS = [
  { id: 'overview', title: 'Overview' },
  { id: 'how-it-works', title: 'How It Works' },
  { id: 'api', title: 'API Reference' },
  { id: 'polymarket', title: 'Polymarket Integration' },
  { id: 'ai-analysis', title: 'AI Analysis' },
  { id: 'categories', title: 'Categories' },
  { id: 'predictions', title: 'Predictions' },
  { id: 'terminal', title: 'Terminal Chat' },
  { id: 'code-examples', title: 'Code Examples' },
  { id: 'architecture', title: 'Architecture' },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

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

            <nav className="flex items-center gap-3">
              <Link href="/" className="brutal-button">
                Home
              </Link>
              <Link href="/chat" className="brutal-button">
                Terminal
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Always visible */}
        <aside className="w-56 border-r border-[#1a1a2e] bg-white min-h-[calc(100vh-64px)] sticky top-16 shrink-0">
          <nav className="p-4">
            <h2 className="font-black text-xs uppercase mb-4 text-[#1a1a2e]/50">// SECTIONS</h2>
            <ul className="space-y-0">
              {SECTIONS.map((section, index) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 text-sm border-l-2 transition-all ${
                      activeSection === section.id
                        ? 'border-[#E63B30] bg-[#E63B30]/5 text-[#E63B30]'
                        : 'border-transparent hover:border-[#4ECDC4] hover:bg-[#f8f8f8]'
                    }`}
                  >
                    <span className="text-[#1a1a2e]/30 mr-2">{String(index + 1).padStart(2, '0')}</span>
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-4xl">

          {/* Overview */}
          {activeSection === 'overview' && (
            <section>
              <h1 className="text-4xl font-black mb-6">CLORACLE DOCUMENTATION</h1>
              <p className="text-lg mb-6">
                Cloracle is an AI-powered prediction oracle that analyzes events from Polymarket 
                and provides independent probability assessments using advanced language models.
              </p>
              
              <div className="brutal-card p-6 mb-6">
                <h3 className="font-black mb-3">KEY FEATURES</h3>
                <ul className="space-y-2">
                  <li>• Real-time event synchronization from Polymarket</li>
                  <li>• AI-powered independent probability analysis</li>
                  <li>• Market divergence tracking</li>
                  <li>• Historical prediction storage</li>
                  <li>• Interactive terminal chat</li>
                  <li>• Category-based event organization</li>
                </ul>
              </div>

              <div className="brutal-card p-6 bg-[#4ECDC4]/10">
                <h3 className="font-black mb-3 text-[#4ECDC4]">TECH STACK</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#1a1a2e]/50">Frontend</p>
                    <p>Next.js 14, React, Tailwind CSS</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#1a1a2e]/50">Database</p>
                    <p>SQLite + Prisma ORM</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#1a1a2e]/50">AI Engine</p>
                    <p>Molt Bot</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#1a1a2e]/50">Data Source</p>
                    <p>Polymarket Gamma API</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* How It Works */}
          {activeSection === 'how-it-works' && (
            <section>
              <h1 className="text-4xl font-black mb-6">HOW IT WORKS</h1>
              
              <div className="space-y-6">
                <div className="brutal-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-10 h-10 bg-[#E63B30] text-white flex items-center justify-center font-black">1</span>
                    <h3 className="font-black text-xl">DATA SYNC</h3>
                  </div>
                  <p>Events are fetched from Polymarket Gamma API. Each event includes title, description, current market probability, and metadata.</p>
                </div>

                <div className="brutal-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-10 h-10 bg-[#4ECDC4] text-white flex items-center justify-center font-black">2</span>
                    <h3 className="font-black text-xl">CATEGORIZATION</h3>
                  </div>
                  <p>Events are automatically categorized based on keyword detection in titles and descriptions (Politics, Crypto, Sports, etc.)</p>
                </div>

                <div className="brutal-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-10 h-10 bg-[#FF6B4A] text-white flex items-center justify-center font-black">3</span>
                    <h3 className="font-black text-xl">AI ANALYSIS</h3>
                  </div>
                  <p>Molt Bot analyzes each event independently, considering factors the market might overlook. It provides probability, reasoning, and confidence level.</p>
                </div>

                <div className="brutal-card p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="w-10 h-10 bg-[#1a1a2e] text-white flex items-center justify-center font-black">4</span>
                    <h3 className="font-black text-xl">DIVERGENCE</h3>
                  </div>
                  <p>The system calculates divergence between market probability and Cloracle's assessment, highlighting potential mispricing.</p>
                </div>
              </div>
            </section>
          )}

          {/* API Reference */}
          {activeSection === 'api' && (
            <section>
              <h1 className="text-4xl font-black mb-6">API REFERENCE</h1>
              
              <div className="space-y-6">
                <div className="brutal-card p-6">
                  <h3 className="font-black text-[#4ECDC4] mb-2">GET /api/events</h3>
                  <p className="mb-4">Fetch events from database</p>
                  <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`// Query parameters
?category=Politics    // Filter by category
?limit=50            // Number of events
?offset=0            // Pagination offset
?analyzed=true       // Only analyzed events

// Response
{
  "events": [...],
  "total": 100,
  "hasMore": true
}`}
                  </pre>
                </div>

                <div className="brutal-card p-6">
                  <h3 className="font-black text-[#4ECDC4] mb-2">POST /api/sync</h3>
                  <p className="mb-4">Sync events from Polymarket</p>
                  <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`// Response
{
  "synced": 50,
  "new": 10,
  "updated": 40
}`}
                  </pre>
                </div>

                <div className="brutal-card p-6">
                  <h3 className="font-black text-[#E63B30] mb-2">POST /api/analyze</h3>
                  <p className="mb-4">Analyze single event with AI</p>
                  <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`// Request body
{
  "eventId": "0x123..."
}

// Response
{
  "event": {
    "cloracleProb": 0.65,
    "cloracleReason": "...",
    "confidence": "medium"
  }
}`}
                  </pre>
                </div>

                <div className="brutal-card p-6">
                  <h3 className="font-black text-[#E63B30] mb-2">POST /api/analyze-all</h3>
                  <p className="mb-4">Batch analyze unanalyzed events</p>
                  <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`// Response
{
  "analyzed": 10,
  "total": 50,
  "results": [...]
}`}
                  </pre>
                </div>

                <div className="brutal-card p-6">
                  <h3 className="font-black text-[#FF6B4A] mb-2">POST /api/chat</h3>
                  <p className="mb-4">Chat with Cloracle AI</p>
                  <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`// Request body
{
  "message": "What do you think about...",
  "eventId": "optional-event-id"
}

// Response
{
  "response": "Based on my analysis..."
}`}
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* Polymarket Integration */}
          {activeSection === 'polymarket' && (
            <section>
              <h1 className="text-4xl font-black mb-6">POLYMARKET INTEGRATION</h1>
              
              <p className="mb-6">
                Cloracle integrates with Polymarket through the Gamma API to fetch real-time prediction market data.
              </p>

              <div className="brutal-card p-6 mb-6">
                <h3 className="font-black mb-4">GAMMA API ENDPOINT</h3>
                <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`const GAMMA_API = 'https://gamma-api.polymarket.com'

// Fetch active events
const response = await fetch(
  \`\${GAMMA_API}/events?limit=100&active=true&closed=false\`
)

const events = await response.json()`}
                </pre>
              </div>

              <div className="brutal-card p-6 mb-6">
                <h3 className="font-black mb-4">EVENT DATA STRUCTURE</h3>
                <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`interface GammaEvent {
  id: string
  slug: string
  title: string
  description: string
  image: string
  volume: number
  markets: [{
    conditionId: string
    question: string
    outcomePrices: string  // JSON array
    volume: number
    endDate: string
  }]
}`}
                </pre>
              </div>

              <div className="brutal-card p-6 bg-[#FF6B4A]/10">
                <h3 className="font-black mb-3">MARKET PROBABILITY</h3>
                <p>Market probability is extracted from the outcomePrices field, which contains a JSON array of prices for each outcome. The first price represents the "Yes" probability.</p>
              </div>
            </section>
          )}

          {/* AI Analysis */}
          {activeSection === 'ai-analysis' && (
            <section>
              <h1 className="text-4xl font-black mb-6">AI ANALYSIS</h1>
              
              <p className="mb-6">
                Cloracle uses Molt Bot to provide independent probability assessments.
              </p>

              <div className="brutal-card p-6 mb-6">
                <h3 className="font-black mb-4">ANALYSIS PROMPT</h3>
                <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm whitespace-pre-wrap">
{`You are Cloracle, an advanced AI oracle 
specialized in predicting event outcomes.

CRITICAL INSTRUCTIONS:
1. Do NOT simply agree with market probability
2. Look for factors the market might miss
3. Consider information asymmetries
4. Provide DETAILED reasoning with facts

Response format:
{
  "probability": 0-100,
  "reasoning": "detailed analysis...",
  "confidence": "low|medium|high",
  "keyFactors": ["factor1", "factor2"]
}`}
                </pre>
              </div>

              <div className="brutal-card p-6 mb-6">
                <h3 className="font-black mb-4">CONFIDENCE LEVELS</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="brutal-tag bg-green-100 text-green-700 border-green-500">HIGH</span>
                    <span>Strong evidence, clear historical precedent</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="brutal-tag bg-yellow-100 text-yellow-700 border-yellow-500">MEDIUM</span>
                    <span>Mixed signals, some uncertainty</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="brutal-tag bg-red-100 text-red-700 border-red-500">LOW</span>
                    <span>High uncertainty, limited data</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Categories */}
          {activeSection === 'categories' && (
            <section>
              <h1 className="text-4xl font-black mb-6">CATEGORIES</h1>
              
              <p className="mb-6">
                Events are automatically categorized based on keyword detection in titles and descriptions.
              </p>

              <div className="space-y-4">
                {[
                  { name: 'Politics', keywords: 'trump, biden, election, president, congress, vote, governor', color: '#E63B30' },
                  { name: 'Crypto', keywords: 'bitcoin, ethereum, token, blockchain, defi, nft, solana', color: '#FF6B4A' },
                  { name: 'Sports', keywords: 'nfl, nba, soccer, championship, playoff, game, team', color: '#4ECDC4' },
                  { name: 'Pop Culture', keywords: 'movie, oscar, celebrity, music, netflix, viral', color: '#9B59B6' },
                  { name: 'Business', keywords: 'stock, market, company, ceo, earnings, tesla, nvidia', color: '#3498DB' },
                  { name: 'Science', keywords: 'nasa, spacex, climate, vaccine, ai, research', color: '#2ECC71' },
                ].map((cat) => (
                  <div key={cat.name} className="brutal-card p-4 flex items-center gap-4">
                    <div 
                      className="w-4 h-4"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <h3 className="font-black">{cat.name}</h3>
                      <p className="text-sm text-[#1a1a2e]/60">{cat.keywords}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="brutal-card p-6 mt-6 bg-[#1a1a2e]/5">
                <h3 className="font-black mb-3">CATEGORY DETECTION CODE</h3>
                <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`function detectCategory(title, description) {
  const text = \`\${title} \${description}\`.toLowerCase()
  
  if (text.match(/trump|biden|election/)) 
    return 'Politics'
  if (text.match(/bitcoin|ethereum|crypto/)) 
    return 'Crypto'
  // ... more patterns
  
  return 'Other'
}`}
                </pre>
              </div>
            </section>
          )}

          {/* Predictions */}
          {activeSection === 'predictions' && (
            <section>
              <h1 className="text-4xl font-black mb-6">PREDICTIONS</h1>
              
              <p className="mb-6">
                Each prediction is stored with full history, allowing tracking of how Cloracle's assessments evolve over time.
              </p>

              <div className="brutal-card p-6 mb-6">
                <h3 className="font-black mb-4">PREDICTION SCHEMA</h3>
                <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`model Prediction {
  id          String   @id
  eventId     String
  probability Float    // 0.0 - 1.0
  reasoning   String   // Markdown text
  confidence  String   // low|medium|high
  createdAt   DateTime
  
  event       Event    @relation
}`}
                </pre>
              </div>

              <div className="brutal-card p-6">
                <h3 className="font-black mb-4">DIVERGENCE CALCULATION</h3>
                <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`// Divergence = Cloracle - Market
const divergence = (cloracleProb - marketProb) * 100

// Positive = Cloracle more bullish
// Negative = Cloracle more bearish

// Significant divergence threshold: ±10%`}
                </pre>
              </div>
            </section>
          )}

          {/* Terminal */}
          {activeSection === 'terminal' && (
            <section>
              <h1 className="text-4xl font-black mb-6">TERMINAL CHAT</h1>
              
              <p className="mb-6">
                The Terminal allows direct conversation with Cloracle AI about any prediction market topic.
              </p>

              <div className="brutal-card p-6 mb-6">
                <h3 className="font-black mb-4">EXAMPLE QUERIES</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-[#f0f0f0]">
                    <span className="text-[#4ECDC4]">&gt;</span> What's your take on Bitcoin reaching $100k?
                  </div>
                  <div className="p-3 bg-[#f0f0f0]">
                    <span className="text-[#4ECDC4]">&gt;</span> Analyze the upcoming US elections
                  </div>
                  <div className="p-3 bg-[#f0f0f0]">
                    <span className="text-[#4ECDC4]">&gt;</span> Why do you disagree with the market on event X?
                  </div>
                </div>
              </div>

              <div className="brutal-card p-6">
                <h3 className="font-black mb-4">CONTEXT-AWARE CHAT</h3>
                <p className="mb-4">When chatting about a specific event, Cloracle receives context including:</p>
                <ul className="space-y-2">
                  <li>• Event title and description</li>
                  <li>• Current market probability</li>
                  <li>• Previous Cloracle analysis (if any)</li>
                  <li>• Historical predictions</li>
                </ul>
              </div>
            </section>
          )}

          {/* Code Examples */}
          {activeSection === 'code-examples' && (
            <section>
              <h1 className="text-4xl font-black mb-6">CODE EXAMPLES</h1>
              
              <div className="space-y-6">
                <div className="brutal-card p-6">
                  <h3 className="font-black mb-4">FETCH & ANALYZE EVENT</h3>
                  <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`// Sync events from Polymarket
await fetch('/api/sync', { method: 'POST' })

// Get events
const { events } = await fetch('/api/events').then(r => r.json())

// Analyze specific event
const analysis = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ eventId: events[0].id })
}).then(r => r.json())

console.log(analysis.event.cloracleProb)
console.log(analysis.event.cloracleReason)`}
                  </pre>
                </div>

                <div className="brutal-card p-6">
                  <h3 className="font-black mb-4">CHAT WITH CLORACLE</h3>
                  <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What factors affect crypto prices?',
    eventId: 'optional-event-context'
  })
}).then(r => r.json())

console.log(response.response)`}
                  </pre>
                </div>

                <div className="brutal-card p-6">
                  <h3 className="font-black mb-4">BATCH ANALYSIS</h3>
                  <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`// Auto-analyze all unanalyzed events
const result = await fetch('/api/analyze-all', {
  method: 'POST'
}).then(r => r.json())

console.log(\`Analyzed \${result.analyzed} events\`)

// Continue if more events
if (result.analyzed < result.total) {
  // Wait and analyze more
  await new Promise(r => setTimeout(r, 1000))
  await fetch('/api/analyze-all', { method: 'POST' })
}`}
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* Architecture */}
          {activeSection === 'architecture' && (
            <section>
              <h1 className="text-4xl font-black mb-6">ARCHITECTURE</h1>
              
              <div className="brutal-card p-6 mb-6">
                <h3 className="font-black mb-4">PROJECT STRUCTURE</h3>
                <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`cloracle/
├── app/
│   ├── api/
│   │   ├── events/route.ts
│   │   ├── sync/route.ts
│   │   ├── analyze/route.ts
│   │   ├── analyze-all/route.ts
│   │   ├── chat/route.ts
│   │   └── reclassify/route.ts
│   ├── docs/page.tsx
│   ├── chat/page.tsx
│   ├── event/[id]/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── EventCard.tsx
│   ├── CategoryFilter.tsx
│   └── ChatInterface.tsx
├── lib/
│   ├── ai.ts          # Molt Bot integration
│   ├── db.ts          # Prisma client
│   └── polymarket.ts  # API client
├── prisma/
│   └── schema.prisma
└── public/
    ├── oracle.png
    └── hero-bg.mp4`}
                </pre>
              </div>

              <div className="brutal-card p-6 mb-6">
                <h3 className="font-black mb-4">DATA FLOW</h3>
                <div className="space-y-2 text-center">
                  <div className="p-3 bg-[#4ECDC4]/20 border border-[#4ECDC4]">Polymarket API</div>
                  <div className="text-2xl">↓</div>
                  <div className="p-3 bg-[#FF6B4A]/20 border border-[#FF6B4A]">Sync & Categorize</div>
                  <div className="text-2xl">↓</div>
                  <div className="p-3 bg-[#1a1a2e]/10 border border-[#1a1a2e]">SQLite Database</div>
                  <div className="text-2xl">↓</div>
                  <div className="p-3 bg-[#E63B30]/20 border border-[#E63B30]">AI Analysis (Molt Bot)</div>
                  <div className="text-2xl">↓</div>
                  <div className="p-3 bg-[#9B59B6]/20 border border-[#9B59B6]">Frontend Display</div>
                </div>
              </div>

              <div className="brutal-card p-6">
                <h3 className="font-black mb-4">DATABASE SCHEMA</h3>
                <pre className="bg-[#1a1a2e] text-white p-4 overflow-x-auto text-sm">
{`model Event {
  id              String   @id
  slug            String   @unique
  title           String
  description     String
  category        String
  marketProb      Float
  cloracleProb    Float?
  cloracleReason  String?
  confidence      String?
  analyzedAt      DateTime?
  predictions     Prediction[]
}

model Prediction {
  id          String   @id
  eventId     String
  probability Float
  reasoning   String
  confidence  String
  event       Event    @relation
}

model ChatMessage {
  id        String   @id
  role      String
  content   String
  eventId   String?
}`}
                </pre>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
