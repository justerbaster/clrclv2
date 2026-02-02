import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        predictions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    const body = await request.json()
    
    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(body.marketProb !== undefined && { marketProb: body.marketProb }),
        ...(body.cloracleProb !== undefined && { cloracleProb: body.cloracleProb }),
        ...(body.cloracleReason !== undefined && { cloracleReason: body.cloracleReason }),
        ...(body.confidence !== undefined && { confidence: body.confidence }),
        ...(body.analyzedAt !== undefined && { analyzedAt: new Date(body.analyzedAt) }),
        ...(body.isActive !== undefined && { isActive: body.isActive })
      }
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  try {
    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}
