import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { analyzeEvent } from '@/lib/ai'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { eventId } = body

    if (!eventId) {
      return NextResponse.json(
        { error: 'eventId is required' },
        { status: 400 }
      )
    }

    // Fetch the event
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Perform AI analysis
    const analysis = await analyzeEvent(
      event.title,
      event.description,
      event.marketProb,
      event.category
    )

    // Update event with analysis
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        cloracleProb: analysis.probability / 100, // Convert to 0-1 range
        cloracleReason: analysis.reasoning,
        confidence: analysis.confidence,
        analyzedAt: new Date()
      }
    })

    // Save prediction to history
    await prisma.prediction.create({
      data: {
        eventId: eventId,
        probability: analysis.probability / 100,
        reasoning: analysis.reasoning,
        confidence: analysis.confidence
      }
    })

    return NextResponse.json({
      event: updatedEvent,
      analysis: {
        probability: analysis.probability,
        reasoning: analysis.reasoning,
        confidence: analysis.confidence,
        keyFactors: analysis.keyFactors
      }
    })
  } catch (error) {
    console.error('Analysis failed:', error)
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Batch analyze multiple events
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { eventIds, limit = 5 } = body

    let events
    if (eventIds && Array.isArray(eventIds)) {
      events = await prisma.event.findMany({
        where: { id: { in: eventIds } }
      })
    } else {
      // Analyze unanalyzed events
      events = await prisma.event.findMany({
        where: {
          isActive: true,
          cloracleProb: null
        },
        take: limit,
        orderBy: { createdAt: 'desc' }
      })
    }

    const results = []

    for (const event of events) {
      try {
        const analysis = await analyzeEvent(
          event.title,
          event.description,
          event.marketProb,
          event.category
        )

        await prisma.event.update({
          where: { id: event.id },
          data: {
            cloracleProb: analysis.probability / 100,
            cloracleReason: analysis.reasoning,
            confidence: analysis.confidence,
            analyzedAt: new Date()
          }
        })

        await prisma.prediction.create({
          data: {
            eventId: event.id,
            probability: analysis.probability / 100,
            reasoning: analysis.reasoning,
            confidence: analysis.confidence
          }
        })

        results.push({
          eventId: event.id,
          status: 'success',
          probability: analysis.probability
        })
      } catch (error) {
        results.push({
          eventId: event.id,
          status: 'error',
          error: String(error)
        })
      }
    }

    return NextResponse.json({
      analyzed: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'error').length,
      results
    })
  } catch (error) {
    console.error('Batch analysis failed:', error)
    return NextResponse.json(
      { error: 'Batch analysis failed' },
      { status: 500 }
    )
  }
}
