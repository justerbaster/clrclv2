'use client'

import Link from 'next/link'

interface EventCardProps {
  id: string
  slug: string
  title: string
  description: string
  category: string
  marketProb: number
  cloracleProb: number | null
  confidence?: string | null
  endDate?: Date | null
  onAnalyze?: () => void
  isAnalyzing?: boolean
  index?: number
}

export function EventCard({
  id,
  title,
  description,
  category,
  marketProb,
  cloracleProb,
  onAnalyze,
  isAnalyzing = false,
  index = 0
}: EventCardProps) {
  const marketPct = Math.round(marketProb * 100)
  const cloraclePct = cloracleProb !== null ? Math.round(cloracleProb * 100) : null
  const difference = cloraclePct !== null ? cloraclePct - marketPct : null

  const indexStr = String(index + 1).padStart(4, '0')

  return (
    <div className="brutal-card bg-white">
      {/* Header */}
      <div className="border-b-2 border-[#1a1a2e] px-4 py-3 flex justify-between items-center">
        <span className="brutal-number">{indexStr}</span>
        <span className="brutal-tag brutal-tag-blue">■ {category}</span>
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/event/${encodeURIComponent(id)}`}>
          <h3 className="font-bold text-sm leading-tight hover:text-[#4ECDC4] cursor-pointer mb-2 line-clamp-2">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-[#1a1a2e]/60 line-clamp-2 mb-4">
          {description}
        </p>

        {/* Probabilities */}
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-[11px] uppercase mb-1 font-semibold">
              <span className="text-[#1a1a2e]/60">Market</span>
              <span>{marketPct}%</span>
            </div>
            <div className="brutal-progress">
              <div className="brutal-progress-fill-blue" style={{ width: `${marketPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[11px] uppercase mb-1 font-semibold">
              <span className="text-orange">Cloracle</span>
              <span className="text-orange">{cloraclePct !== null ? `${cloraclePct}%` : '—'}</span>
            </div>
            <div className="brutal-progress">
              {cloraclePct !== null ? (
                <div className="brutal-progress-fill" style={{ width: `${cloraclePct}%` }} />
              ) : (
                <div className="h-full bg-gray-100" style={{ width: '100%' }} />
              )}
            </div>
          </div>

          {difference !== null && (
            <div className="flex items-center justify-between pt-2 text-[11px] uppercase font-semibold">
              <span className="text-[#1a1a2e]/40">Divergence</span>
              <span className={Math.abs(difference) >= 10 ? 'text-orange' : ''}>
                {difference > 0 ? '+' : ''}{difference}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="border-t-2 border-[#1a1a2e] px-4 py-3 flex gap-2">
        {!cloracleProb && onAnalyze && (
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="brutal-button-orange flex-1 disabled:opacity-50"
          >
            {isAnalyzing ? '...' : 'Analyze'}
          </button>
        )}
        <Link
          href={`/event/${encodeURIComponent(id)}`}
          className="brutal-button flex-1 text-center"
        >
          Details →
        </Link>
      </div>
    </div>
  )
}
