import { useRef } from 'react'
import { useBooking } from '../hooks/useBooking'

// Slots with some pre-marked unavailable
const BASE_SLOTS = [
  { id: 1, day: 'Mon', time: '5:00 PM',  unavailable: false },
  { id: 2, day: 'Tue', time: '7:00 PM',  unavailable: true  },
  { id: 3, day: 'Wed', time: '6:00 PM',  unavailable: false },
  { id: 4, day: 'Thu', time: '8:00 PM',  unavailable: false },
  { id: 5, day: 'Fri', time: '4:00 PM',  unavailable: true  },
  { id: 6, day: 'Sat', time: '10:00 AM', unavailable: false },
]

function addRipple(e) {
  const btn = e.currentTarget
  const circle = document.createElement('span')
  const diameter = Math.max(btn.clientWidth, btn.clientHeight)
  const rect = btn.getBoundingClientRect()
  circle.style.width  = circle.style.height = `${diameter}px`
  circle.style.left   = `${e.clientX - rect.left  - diameter / 2}px`
  circle.style.top    = `${e.clientY - rect.top   - diameter / 2}px`
  circle.classList.add('ripple')
  btn.querySelector('.ripple')?.remove()
  btn.appendChild(circle)
}

export default function BookingSection({ skillId, skillTitle, instructorName, onViewBookings }) {
  const { selectedSlot, loading, booked, bookedSlot, selectSlot, confirm, reset } =
    useBooking(skillId, skillTitle, instructorName, BASE_SLOTS)

  // ── Success state ──────────────────────────────────────────────
  if (booked && bookedSlot) {
    return (
      <div className="animate-success-pop flex flex-col items-center text-center gap-3 py-2">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-2xl shadow-lg ring-4 ring-green-200/50 dark:ring-green-800/30">
          ✅
        </div>

        <div>
          <p className="text-base font-bold text-green-600 dark:text-green-400">Session Booked Successfully!</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span className="font-semibold text-gray-700 dark:text-gray-300">{bookedSlot.day} · {bookedSlot.time}</span>
            {' '}with <span className="font-semibold text-violet-600 dark:text-violet-400">{instructorName}</span>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 italic">"{skillTitle}"</p>
        </div>

        {/* Post-booking actions */}
        <div className="flex gap-2 w-full mt-1">
          <button
            onClick={onViewBookings}
            className="ripple-btn flex-1 py-2.5 rounded-xl text-xs font-semibold
                       bg-violet-600 hover:bg-violet-700 active:scale-95 text-white
                       shadow-md shadow-violet-500/25 transition-all duration-200"
            onMouseDown={addRipple}
          >
            📋 View My Bookings
          </button>
          <button
            onClick={reset}
            className="ripple-btn flex-1 py-2.5 rounded-xl text-xs font-semibold
                       bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                       text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700
                       active:scale-95 transition-all duration-200"
            onMouseDown={addRipple}
          >
            🔄 Book Another Slot
          </button>
        </div>
      </div>
    )
  }

  // ── Booking form ───────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-sm">📅</div>
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Available Slots</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {BASE_SLOTS.map((slot, i) => {
          const isSelected   = selectedSlot === slot.id
          const isUnavailable = slot.unavailable

          return (
            <button
              key={slot.id}
              disabled={isUnavailable || loading}
              onClick={() => selectSlot(slot.id)}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`animate-slot-in relative flex flex-col items-center py-3 px-2 rounded-xl border
                          text-xs font-medium select-none transition-all duration-200
                          ${isUnavailable
                            ? 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            : isSelected
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 shadow-md shadow-violet-200/50 dark:shadow-violet-900/30 scale-105'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 hover:scale-105 cursor-pointer'
                          }`}
            >
              {isUnavailable ? (
                <>
                  <span className="font-bold text-sm leading-none mb-0.5 line-through opacity-50">{slot.day}</span>
                  <span className="text-[10px] text-red-400 dark:text-red-500 font-semibold">Unavailable</span>
                </>
              ) : (
                <>
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center text-white text-[9px]">✓</span>
                  )}
                  <span className="font-bold text-sm leading-none mb-0.5">{slot.day}</span>
                  <span className="leading-none">{slot.time}</span>
                </>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected slot summary */}
      {selectedSlot && !loading && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 animate-fade-in">
          <svg className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-violet-700 dark:text-violet-300">
            <span className="font-semibold">{BASE_SLOTS.find(s => s.id === selectedSlot)?.day}</span>
            {' · '}
            <span className="font-semibold">{BASE_SLOTS.find(s => s.id === selectedSlot)?.time}</span>
            {' with '}
            <span className="font-semibold">{instructorName}</span>
          </p>
        </div>
      )}

      <button
        disabled={!selectedSlot || loading}
        onClick={(e) => { addRipple(e); confirm() }}
        className="ripple-btn w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200
                   flex items-center justify-center gap-2
                   bg-violet-600 hover:bg-violet-700 active:scale-95 text-white
                   shadow-lg shadow-violet-500/25
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Confirming...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Confirm Booking
          </>
        )}
      </button>
    </div>
  )
}
