'use client'

import { useCallback, useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

type BookingStatus = 'PENDING' | 'CONTACTED' | 'CONFIRMED' | 'CANCELLED'

type Booking = {
  id: string
  name: string
  email: string
  location: string
  reason: string
  status: BookingStatus
  notes: string | null
  createdAt: string
}

const statusOptions: BookingStatus[] = ['PENDING', 'CONTACTED', 'CONFIRMED', 'CANCELLED']

function getBadgeVariant(status: BookingStatus): 'outline' | 'secondary' | 'default' | 'destructive' {
  if (status === 'PENDING') return 'secondary'
  if (status === 'CONTACTED') return 'outline'
  if (status === 'CONFIRMED') return 'default'
  return 'destructive'
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statusDrafts, setStatusDrafts] = useState<Record<string, BookingStatus>>({})
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadBookings = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true)
    else setIsLoading(true)

    setError(null)

    try {
      const response = await fetch('/api/bookings?limit=200', { cache: 'no-store' })
      const data = await response.json()

      if (!response.ok) {
        setError(data?.error ?? 'Failed to load bookings.')
        return
      }

      const nextBookings = data.bookings as Booking[]
      setBookings(nextBookings)
      setStatusDrafts(Object.fromEntries(nextBookings.map((booking) => [booking.id, booking.status])))
      setNoteDrafts(Object.fromEntries(nextBookings.map((booking) => [booking.id, booking.notes ?? ''])))
    } catch {
      setError('Failed to load bookings.')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  const handleSave = async (bookingId: string) => {
    setSavingId(bookingId)
    setError(null)

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: statusDrafts[bookingId],
          notes: noteDrafts[bookingId],
        }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error ?? 'Failed to update booking.')
        return
      }

      setBookings((prev) =>
        prev.map((booking) => (booking.id === bookingId ? (data.booking as Booking) : booking))
      )
    } catch {
      setError('Failed to update booking.')
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (bookingId: string) => {
    setDeletingId(bookingId)
    setError(null)

    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        setError(data?.error ?? 'Failed to delete booking.')
        return
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId))
      setStatusDrafts((prev) => {
        const next = { ...prev }
        delete next[bookingId]
        return next
      })
      setNoteDrafts((prev) => {
        const next = { ...prev }
        delete next[bookingId]
        return next
      })
    } catch {
      setError('Failed to delete booking.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-background py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
            <p className="text-muted-foreground">View and manage incoming bookings.</p>
          </div>
          <Button variant="outline" onClick={() => loadBookings(true)} disabled={isRefreshing || isLoading}>
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">Loading bookings...</CardContent>
          </Card>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">No bookings yet.</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <CardTitle>{booking.name}</CardTitle>
                      <CardDescription>
                        {booking.email} • {booking.location}
                      </CardDescription>
                    </div>
                    <Badge variant={getBadgeVariant(booking.status)}>{booking.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{booking.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    Received {new Date(booking.createdAt).toLocaleString()}
                  </p>

                  <div className="grid gap-3">
                    <label className="text-sm font-medium" htmlFor={`status-${booking.id}`}>
                      Status
                    </label>
                    <select
                      id={`status-${booking.id}`}
                      value={statusDrafts[booking.id] ?? booking.status}
                      onChange={(event) =>
                        setStatusDrafts((prev) => ({
                          ...prev,
                          [booking.id]: event.target.value as BookingStatus,
                        }))
                      }
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      {statusOptions.map((statusOption) => (
                        <option key={statusOption} value={statusOption}>
                          {statusOption}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-3">
                    <label className="text-sm font-medium" htmlFor={`notes-${booking.id}`}>
                      Notes
                    </label>
                    <Textarea
                      id={`notes-${booking.id}`}
                      value={noteDrafts[booking.id] ?? ''}
                      onChange={(event) =>
                        setNoteDrafts((prev) => ({
                          ...prev,
                          [booking.id]: event.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Add notes"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button onClick={() => handleSave(booking.id)} disabled={savingId === booking.id}>
                      {savingId === booking.id ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(booking.id)}
                      disabled={deletingId === booking.id}
                    >
                      {deletingId === booking.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
