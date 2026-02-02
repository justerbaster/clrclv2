import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { fetchAllEvents, type PolymarketEvent } from '@/lib/polymarket'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST() {
  try {
    // Fetch events from Polymarket
    const polymarketEvents = await fetchAllEvents()
    
    if (polymarketEvents.length === 0) {
      return NextResponse.json({
        message: 'No events fetched from Polymarket',
        created: 0,
        updated: 0
      })
    }

    let created = 0
    let updated = 0

    // Process each event with deduplication
    for (const event of polymarketEvents) {
      const existing = await prisma.event.findUnique({
        where: { id: event.id }
      })

      if (existing) {
        // Update existing event if market probability changed
        if (Math.abs(existing.marketProb - event.marketProb) > 0.001) {
          await prisma.event.update({
            where: { id: event.id },
            data: {
              marketProb: event.marketProb,
              volume: event.volume,
              title: event.title,
              description: event.description,
              imageUrl: event.imageUrl,
              endDate: event.endDate
            }
          })
          updated++
        }
      } else {
        // Create new event (deduplication by unique ID)
        try {
          await prisma.event.create({
            data: {
              id: event.id,
              slug: event.slug,
              title: event.title,
              description: event.description,
              category: event.category,
              imageUrl: event.imageUrl,
              marketProb: event.marketProb,
              volume: event.volume,
              endDate: event.endDate,
              isActive: true
            }
          })
          created++
        } catch (error) {
          // Handle unique constraint violation (slug collision)
          console.warn(`Skipping duplicate event: ${event.slug}`)
        }
      }
    }

    // Mark events as inactive if they're no longer in Polymarket
    const activeIds = polymarketEvents.map(e => e.id)
    await prisma.event.updateMany({
      where: {
        id: { notIn: activeIds },
        isActive: true
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({
      message: 'Sync completed successfully',
      created,
      updated,
      total: polymarketEvents.length
    })
  } catch (error) {
    console.error('Sync failed:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Get sync status
  try {
    const [total, analyzed, lastUpdated] = await Promise.all([
      prisma.event.count({ where: { isActive: true } }),
      prisma.event.count({ where: { isActive: true, cloracleProb: { not: null } } }),
      prisma.event.findFirst({
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true }
      })
    ])

    return NextResponse.json({
      totalEvents: total,
      analyzedEvents: analyzed,
      lastSync: lastUpdated?.updatedAt || null
    })
  } catch (error) {
    console.error('Failed to get sync status:', error)
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    )
  }
}
