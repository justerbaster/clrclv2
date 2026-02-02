import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { analyzeEvent } from '@/lib/ai'

export async function POST() {
  try {
    // Get all events without analysis
    const unanalyzedEvents = await prisma.event.findMany({
      where: {
        OR: [
          { cloracleProb: null },
          { cloracleReason: null }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 10 // Analyze 10 events per batch
    })

    if (unanalyzedEvents.length === 0) {
      return NextResponse.json({ 
        message: 'All events already analyzed',
        analyzed: 0 
      })
    }

    const results = []
    
    for (const event of unanalyzedEvents) {
      try {
        // Delay between requests (Gemini allows 60 RPM)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const analysis = await analyzeEvent({
          title: event.title,
          description: event.description,
          category: event.category,
          marketProb: event.marketProb
        })

        // Skip if analysis failed (contains error message)
        if (analysis.reasoning.includes('temporarily unavailable') || analysis.reasoning.includes('pending')) {
          results.push({ id: event.id, success: false, reason: 'rate_limit' })
          continue
        }

        // Update event with analysis
        await prisma.event.update({
          where: { id: event.id },
          data: {
            cloracleProb: analysis.probability / 100,
            cloracleReason: analysis.reasoning,
            confidence: analysis.confidence,
            analyzedAt: new Date()
          }
        })

        // Save prediction to history
        await prisma.prediction.create({
          data: {
            eventId: event.id,
            probability: analysis.probability / 100,
            reasoning: analysis.reasoning,
            confidence: analysis.confidence
          }
        })

        results.push({ id: event.id, success: true })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ''
        console.error(`Failed to analyze event ${event.id}:`, error)
        
        // If rate limit, wait longer before next attempt
        if (errorMessage.includes('RATE_LIMIT')) {
          console.log('Rate limit hit, waiting 10 seconds...')
          await new Promise(resolve => setTimeout(resolve, 10000))
        }
        
        results.push({ id: event.id, success: false, reason: errorMessage.includes('RATE_LIMIT') ? 'rate_limit' : 'error' })
      }
    }

    const successCount = results.filter(r => r.success).length

    return NextResponse.json({
      message: `Analyzed ${successCount} of ${unanalyzedEvents.length} events`,
      analyzed: successCount,
      total: unanalyzedEvents.length,
      results
    })
  } catch (error) {
    console.error('Auto-analyze error:', error)
    return NextResponse.json(
      { error: 'Failed to auto-analyze events' },
      { status: 500 }
    )
  }
}
