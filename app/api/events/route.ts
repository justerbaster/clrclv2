import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')
  const analyzed = searchParams.get('analyzed')

  try {
    const where: Record<string, unknown> = {
      isActive: true
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (analyzed === 'true') {
      where.cloracleProb = { not: null }
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          predictions: {
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }),
      prisma.event.count({ where })
    ])

    return NextResponse.json({
      events,
      total,
      limit,
      offset,
      hasMore: offset + events.length < total
    })
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const event = await prisma.event.create({
      data: {
        id: body.id,
        slug: body.slug,
        title: body.title,
        description: body.description || '',
        category: body.category || 'Other',
        imageUrl: body.imageUrl,
        marketProb: body.marketProb,
        volume: body.volume,
        endDate: body.endDate ? new Date(body.endDate) : null,
        isActive: true
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
