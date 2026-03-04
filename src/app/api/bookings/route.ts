import { NextResponse } from 'next/server'
import { z } from 'zod'

import { db } from '@/lib/db'

const createBookingSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120),
  email: z.string().trim().email('Valid email is required').max(320),
  location: z.string().trim().min(1, 'Location is required').max(200),
  reason: z.string().trim().min(1, 'Reason is required').max(2000),
})

const bookingStatusSchema = z.enum(['PENDING', 'CONTACTED', 'CONFIRMED', 'CANCELLED'])

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limitParam = searchParams.get('limit')
    const parsedStatus = status ? bookingStatusSchema.safeParse(status) : null

    if (parsedStatus && !parsedStatus.success) {
      return NextResponse.json(
        { error: 'Invalid status filter. Use PENDING, CONTACTED, CONFIRMED, or CANCELLED.' },
        { status: 400 }
      )
    }

    const parsedLimit = limitParam ? Number.parseInt(limitParam, 10) : 50
    const take = Number.isNaN(parsedLimit) ? 50 : Math.min(Math.max(parsedLimit, 1), 200)

    const bookings = await db.booking.findMany({
      where: parsedStatus?.success ? { status: parsedStatus.data } : undefined,
      orderBy: { createdAt: 'desc' },
      take,
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createBookingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid request body',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const booking = await db.booking.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        location: parsed.data.location,
        reason: parsed.data.reason,
      },
    })

    return NextResponse.json({ booking }, { status: 201 })
  } catch (error) {
    console.error('Failed to create booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
