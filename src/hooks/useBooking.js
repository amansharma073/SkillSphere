import { useState } from 'react'
import { useLocalStorage } from './useLocalStorage'

/**
 * Encapsulates all booking state for a single skill session.
 *
 * @param {string} skillId   - unique skill identifier
 * @param {string} skillTitle
 * @param {string} instructorName
 * @param {Array}  slots     - full slot list [{ id, day, time, unavailable? }]
 */
export function useBooking(skillId, skillTitle, instructorName, slots) {
  // Persisted: map of skillId → { slotId, day, time, instructor, title }
  const [allBookings, setAllBookings] = useLocalStorage('ss_bookings', {})

  const existing = allBookings[skillId] ?? null

  const [selectedSlot, setSelectedSlot] = useState(existing?.slotId ?? null)
  const [loading, setLoading]           = useState(false)
  const [booked, setBooked]             = useState(!!existing)

  function selectSlot(id) {
    if (booked || loading) return
    const slot = slots.find(s => s.id === id)
    if (!slot || slot.unavailable) return
    setSelectedSlot(id)
  }

  function confirm() {
    if (!selectedSlot || loading || booked) return
    const slot = slots.find(s => s.id === selectedSlot)
    if (!slot) return

    setLoading(true)
    setTimeout(() => {
      const booking = {
        slotId:     slot.id,
        day:        slot.day,
        time:       slot.time,
        instructor: instructorName,
        title:      skillTitle,
        bookedAt:   new Date().toISOString(),
      }
      setAllBookings(prev => ({ ...prev, [skillId]: booking }))
      setLoading(false)
      setBooked(true)
    }, 1000)
  }

  function reset() {
    setBooked(false)
    setSelectedSlot(null)
    setAllBookings(prev => {
      const next = { ...prev }
      delete next[skillId]
      return next
    })
  }

  const bookedSlot = slots.find(s => s.id === selectedSlot) ?? null

  return { selectedSlot, loading, booked, bookedSlot, allBookings, selectSlot, confirm, reset }
}
