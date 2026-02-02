import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { chat } from '@/lib/ai'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, eventId } = body

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      )
    }

    // Get event context if eventId is provided
    let eventContext: {
      eventTitle?: string
      eventDescription?: string
      marketProb?: number
    } | undefined

    if (eventId) {
      const event = await prisma.event.findUnique({
        where: { id: eventId }
      })

      if (event) {
        eventContext = {
          eventTitle: event.title,
          eventDescription: event.description,
          marketProb: event.marketProb
        }
      }
    }

    // Get AI response
    const response = await chat(message, eventContext)

    // Save chat message to history
    await prisma.chatMessage.create({
      data: {
        role: 'user',
        content: message,
        eventId: eventId || null
      }
    })

    await prisma.chatMessage.create({
      data: {
        role: 'assistant',
        content: response.content,
        eventId: eventId || null
      }
    })

    return NextResponse.json({
      message: response.content,
      eventId: response.relatedEventId
    })
  } catch (error) {
    console.error('Chat failed:', error)
    return NextResponse.json(
      { error: 'Chat failed', details: String(error) },
      { status: 500 }
    )
  }
}

// Get chat history
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const eventId = searchParams.get('eventId')
  const limit = parseInt(searchParams.get('limit') || '50')

  try {
    const messages = await prisma.chatMessage.findMany({
      where: eventId ? { eventId } : {},
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json({
      messages: messages.reverse()
    })
  } catch (error) {
    console.error('Failed to fetch chat history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }
}
