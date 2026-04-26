import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_USERS } from '../data/mockData'
import { getUserBadges } from '../utils/badges'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from '../context/AuthContext'
import Badge from './Badge'
import BookingSection from './BookingSection'
import InstructorProfile from './InstructorProfile'

const CATEGORY_COLORS = {
  Coding:      'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20',
  Music:       'bg-pink-500/10 text-pink-600 dark:text-pink-400 ring-1 ring-pink-500/20',
  Art:         'bg-orange-500/10 text-orange-600 dark:text-orange-400 ring-1 ring-orange-500/20',
  Fitness:     'bg-green-500/10 text-green-600 dark:text-green-400 ring-1 ring-green-500/20',
  Cooking:     'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-500/20',
  Photography: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20',
  Design:      'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20',
  Language:    'bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20',
  Business:    'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20',
}

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

// Small inline prompt shown when a guest tries a gated action
function LoginPrompt({ action, onClose }) {
  return (
    <div className="flex items-start gap-3 mb-4 px-4 py-3 rounded-xl
                    bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40
                    animate-fade-in">
      <span className="text-lg flex-shrink-0">🔒</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Sign in required</p>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
          You need an account to {action}.
        </p>
        <div className="flex gap-2 mt-2.5">
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
          >
            Sign Up Free
          </Link>
          <button
            onClick={onClose}
            className="ml-auto text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SkillModal({ skill, onClose, onOpenSkill }) {
  const { currentUser } = useAuth()
  const [visible, setVisible]               = useState(false)
  const [showBooking, setShowBooking]       = useState(false)
  const [bookingHeight, setBookingHeight]   = useState(0)
  const [showInstructor, setShowInstructor] = useState(false)
  const [showBookingsList, setShowBookingsList] = useState(false)
  const [authPrompt, setAuthPrompt]         = useState(null) // null | 'book' | 'save'

  // Persisted saved state
  const [savedSkills, setSavedSkills] = useLocalStorage('ss_saved_skills', {})
  const saved = !!savedSkills[skill.id]

  function toggleSave() {
    if (!currentUser) { setAuthPrompt('save'); return }
    setSavedSkills(prev => {
      const next = { ...prev }
      if (next[skill.id]) delete next[skill.id]
      else next[skill.id] = { id: skill.id, title: skill.title, savedAt: new Date().toISOString() }
      return next
    })
  }

  function handleBookClick() {
    if (!currentUser) { setAuthPrompt('book'); return }
    setAuthPrompt(null)
    setShowBooking(v => !v)
  }

  // Persisted bookings (read-only here, managed by useBooking)
  const [allBookings] = useLocalStorage('ss_bookings', {})

  const bookingRef = useRef(null)

  // Smooth height expand for booking panel
  useEffect(() => {
    if (!bookingRef.current) return
    setBookingHeight(showBooking ? bookingRef.current.scrollHeight : 0)
  }, [showBooking])

  // Re-measure if booking content changes (e.g. success state is taller)
  const resizeObserver = useRef(null)
  useEffect(() => {
    if (!bookingRef.current) return
    resizeObserver.current = new ResizeObserver(() => {
      if (showBooking && bookingRef.current) {
        setBookingHeight(bookingRef.current.scrollHeight)
      }
    })
    resizeObserver.current.observe(bookingRef.current)
    return () => resizeObserver.current?.disconnect()
  }, [showBooking])

  useEffect(() => { requestAnimationFrame(() => setVisible(true)) }, [])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 250)
  }

  const creator    = MOCK_USERS[skill.userId]
  const badges     = creator ? getUserBadges(creator) : []
  const colorClass = CATEGORY_COLORS[skill.category] || 'bg-gray-500/10 text-gray-600 ring-1 ring-gray-500/20'
  const bookingCount = Object.keys(allBookings).length

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4
                    transition-all duration-250
                    ${visible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}`}
        onClick={handleClose}
      >
        {/* Modal — full screen on mobile, centered card on sm+ */}
        <div
          className={`relative bg-white dark:bg-gray-900 w-full sm:max-w-lg
                      sm:rounded-2xl rounded-t-2xl shadow-2xl
                      max-h-[95vh] sm:max-h-[90vh] overflow-y-auto
                      border border-gray-100 dark:border-gray-700
                      transition-all duration-250 origin-bottom sm:origin-center
                      ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 sm:translate-y-0 sm:scale-90'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50
                       text-white flex items-center justify-center transition-colors backdrop-blur-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Hero image */}
          <div className="relative h-52 overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex-shrink-0">
            {skill.image && (
              <img src={skill.image} alt={skill.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${colorClass}`}>
                {skill.category}
              </span>
              {saved && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm bg-violet-500/80 text-white">
                  ✔ Saved
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-5 pb-28 sm:pb-6">

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-snug">
              {skill.title}
            </h2>

            {/* Instructor row */}
            <div className="flex items-center gap-2.5 mb-4">
              {creator?.avatar ? (
                <img src={creator.avatar} alt={skill.userName}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0 ring-2 ring-violet-200 dark:ring-violet-700" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {skill.userName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">{skill.userName}</span>
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {badges.map(b => <Badge key={b.key} badge={b} size="sm" />)}
                  </div>
                )}
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-rose-500 dark:text-rose-400 flex-shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                </svg>
                <span className="text-sm font-semibold">{skill.likes}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              {skill.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${colorClass}`}>{skill.category}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700">Live Sessions</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ring-1 ring-gray-200 dark:ring-gray-700">Beginner Friendly</span>
            </div>

            {/* Bookings summary pill */}
            {bookingCount > 0 && (
              <button
                onClick={() => setShowBookingsList(v => !v)}
                className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-violet-50 dark:bg-violet-900/20
                           border border-violet-100 dark:border-violet-800/30 text-xs font-semibold
                           text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30
                           transition-colors duration-200 w-full"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                📋 {bookingCount} session{bookingCount > 1 ? 's' : ''} booked
                <svg className={`w-3 h-3 ml-auto transition-transform duration-200 ${showBookingsList ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}

            {/* Bookings list */}
            {showBookingsList && (
              <div className="mb-4 rounded-xl border border-violet-100 dark:border-violet-800/30 overflow-hidden animate-fade-in">
                {Object.entries(allBookings).map(([sid, b]) => (
                  <div key={sid} className="flex items-center gap-3 px-3 py-2.5 border-b last:border-0 border-violet-50 dark:border-violet-900/20 bg-white dark:bg-gray-900">
                    <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm flex-shrink-0">✅</div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{b.title}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{b.day} · {b.time} · {b.instructor}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Auth prompt (shown when guest tries gated action) */}
            {authPrompt && (
              <LoginPrompt
                action={authPrompt === 'book' ? 'book a live session' : 'save this skill'}
                onClose={() => setAuthPrompt(null)}
              />
            )}

            {/* Booking expand panel */}
            <div
              style={{ height: bookingHeight, transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)' }}
              className="overflow-hidden"
            >
              <div ref={bookingRef}>
                <div className="mb-5 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/40">
                  <BookingSection
                    skillId={skill.id}
                    skillTitle={skill.title}
                    instructorName={skill.userName}
                    onViewBookings={() => { setShowBookingsList(true); setShowBooking(false) }}
                  />
                </div>
              </div>
            </div>

            {/* Desktop action buttons (hidden on mobile — sticky bar handles it) */}
            <div className="hidden sm:flex flex-col gap-2.5">
              <ActionButtons
                showBooking={showBooking}
                onBookClick={handleBookClick}
                setShowInstructor={setShowInstructor}
                saved={saved}
                toggleSave={toggleSave}
              />
            </div>
          </div>

          {/* ── Sticky bottom CTA (mobile only) ── */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-[55] bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex gap-2 shadow-2xl">
            <button
              onMouseDown={addRipple}
              onClick={handleBookClick}
              className={`ripple-btn flex-1 flex items-center justify-center gap-2 py-3 rounded-xl
                          font-medium text-sm leading-none
                          active:scale-95 transition-all duration-200 shadow-lg
                          ${showBooking ? 'bg-violet-700 text-white shadow-violet-500/25' : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25'}`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="leading-none">{showBooking ? 'Hide' : 'Book Session'}</span>
            </button>
            <button
              onMouseDown={addRipple}
              onClick={toggleSave}
              className={`ripple-btn w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                          active:scale-95 transition-all duration-200 border
                          ${saved
                            ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-500/25'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                          }`}
            >
              <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              onMouseDown={addRipple}
              onClick={() => setShowInstructor(true)}
              className="ripple-btn w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                         bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400
                         border border-gray-200 dark:border-gray-700 active:scale-95 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {showInstructor && (
        <InstructorProfile
          userId={skill.userId}
          onClose={() => setShowInstructor(false)}
          onOpenSkill={(s) => { onOpenSkill?.(s) }}
        />
      )}
    </>
  )
}

// Extracted desktop action buttons
function ActionButtons({ showBooking, onBookClick, setShowInstructor, saved, toggleSave }) {
  return (
    <>
      {/* Book Live Session */}
      <button
        onMouseDown={addRipple}
        onClick={onBookClick}
        className={`ripple-btn relative flex items-center justify-center gap-2 w-full py-3 rounded-xl
                    font-medium text-sm leading-none
                    active:scale-95 hover:scale-[1.02] transition-all duration-200 shadow-lg
                    ${showBooking
                      ? 'bg-violet-700 hover:bg-violet-800 text-white shadow-violet-500/25'
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25'}`}
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="leading-none">{showBooking ? 'Hide Booking' : 'Book Live Session'}</span>
        <svg
          className={`w-4 h-4 flex-shrink-0 absolute right-4 transition-transform duration-300 ${showBooking ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* View Instructor Profile */}
      <button
        onMouseDown={addRipple}
        onClick={() => setShowInstructor(true)}
        className="ripple-btn flex items-center justify-center gap-2 w-full py-3 rounded-xl
                   font-medium text-sm leading-none
                   bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                   active:scale-95 hover:scale-[1.02]
                   text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700
                   shadow-sm transition-all duration-200"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span className="leading-none">View Instructor Profile</span>
      </button>

      {/* Save Skill */}
      <button
        onMouseDown={addRipple}
        onClick={toggleSave}
        className={`ripple-btn flex items-center justify-center gap-2 w-full py-3 rounded-xl
                    font-medium text-sm leading-none
                    active:scale-95 hover:scale-[1.02] transition-all duration-200 border
                    ${saved
                      ? 'bg-violet-600 hover:bg-violet-700 text-white border-violet-600 shadow-lg shadow-violet-500/25'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
      >
        <svg
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${saved ? 'scale-110' : ''}`}
          fill={saved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span className="leading-none">{saved ? 'Saved ✔' : 'Save Skill'}</span>
      </button>
    </>
  )
}
