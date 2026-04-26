import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MOCK_USER, MOCK_USERS, MOCK_SKILLS } from '../data/mockData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useAuth } from '../context/AuthContext'

// ── Panel components ────────────────────────────────────────────

function PanelHeader({ title, onClose }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
      <p className="font-bold text-sm text-gray-900 dark:text-white">{title}</p>
      <button
        onClick={onClose}
        className="w-6 h-6 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function EmptyState({ icon, text }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400 dark:text-gray-600">
      <span className="text-3xl">{icon}</span>
      <p className="text-xs">{text}</p>
    </div>
  )
}

function BookingsPanel({ onClose }) {
  const [bookings] = useLocalStorage('ss_bookings', {})
  const entries = Object.entries(bookings)

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="My Bookings" onClose={onClose} />
      <div className="flex-1 overflow-y-auto p-3">
        {entries.length === 0 ? (
          <EmptyState icon="📅" text="No sessions booked yet" />
        ) : (
          <div className="flex flex-col gap-2">
            {entries.map(([sid, b]) => (
              <div key={sid} className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30">
                <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-base flex-shrink-0">✅</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{b.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {b.day} · {b.time}
                  </p>
                  <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">with {b.instructor}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SavedSkillsPanel({ onClose }) {
  const [savedSkills] = useLocalStorage('ss_saved_skills', {})
  const entries = Object.values(savedSkills)
  // Enrich with full skill data
  const enriched = entries.map(s => MOCK_SKILLS.find(ms => ms.id === s.id)).filter(Boolean)

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Saved Skills" onClose={onClose} />
      <div className="flex-1 overflow-y-auto p-3">
        {enriched.length === 0 ? (
          <EmptyState icon="🔖" text="No saved skills yet" />
        ) : (
          <div className="flex flex-col gap-2">
            {enriched.map(s => (
              <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 hover:border-violet-200 dark:hover:border-violet-700/50 transition-colors">
                <img src={s.image} alt={s.title} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{s.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{s.category} · ❤️ {s.likes}</p>
                </div>
                <svg className="w-4 h-4 text-violet-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function FollowingPanel({ onClose }) {
  // Collect all followed instructor IDs from localStorage
  const followedIds = Object.keys(MOCK_USERS).filter(uid => {
    try { return JSON.parse(localStorage.getItem(`ss_follow_${uid}`)) === true } catch { return false }
  })
  const instructors = followedIds.map(id => MOCK_USERS[id]).filter(Boolean)

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Following" onClose={onClose} />
      <div className="flex-1 overflow-y-auto p-3">
        {instructors.length === 0 ? (
          <EmptyState icon="👥" text="Not following anyone yet" />
        ) : (
          <div className="flex flex-col gap-2">
            {instructors.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60">
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-violet-200 dark:ring-violet-700" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{u.skillsShared} skills · ❤️ {u.totalLikes}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">Following</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const DUMMY_MESSAGES = [
  { id: 1, from: 'Maria Garcia',  avatar: MOCK_USERS.u2.avatar, text: 'Hey! When is the next guitar session?', time: '2m ago',  unread: true  },
  { id: 2, from: 'James Lee',     avatar: MOCK_USERS.u4.avatar, text: 'Thanks for booking the HIIT class!',    time: '1h ago',  unread: false },
  { id: 3, from: 'Priya Patel',   avatar: MOCK_USERS.u3.avatar, text: 'Your watercolor tips were amazing 🎨',  time: '3h ago',  unread: false },
]

function MessagesPanel({ onClose }) {
  const [msgs, setMsgs] = useState(DUMMY_MESSAGES)

  return (
    <div className="flex flex-col h-full">
      <PanelHeader title="Messages" onClose={onClose} />
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex flex-col gap-1.5">
          {msgs.map(m => (
            <button
              key={m.id}
              onClick={() => setMsgs(prev => prev.map(x => x.id === m.id ? { ...x, unread: false } : x))}
              className={`flex items-start gap-3 p-3 rounded-xl text-left w-full transition-all duration-200
                          ${m.unread
                            ? 'bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30'
                            : 'bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 hover:border-violet-200 dark:hover:border-violet-700/50'
                          }`}
            >
              <div className="relative flex-shrink-0">
                <img src={m.avatar} alt={m.from} className="w-9 h-9 rounded-full object-cover" />
                {m.unread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-violet-500 rounded-full border-2 border-white dark:border-gray-900" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm truncate ${m.unread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{m.from}</p>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex-shrink-0">{m.time}</span>
                </div>
                <p className={`text-xs mt-0.5 truncate ${m.unread ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>{m.text}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Badge count pill ────────────────────────────────────────────
function Badge({ count }) {
  if (!count) return null
  return (
    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
      {count > 9 ? '9+' : count}
    </span>
  )
}

// ── Main component ──────────────────────────────────────────────
const PANELS = { bookings: BookingsPanel, saved: SavedSkillsPanel, following: FollowingPanel, messages: MessagesPanel }

export default function UserDropdown() {
  const { currentUser, logout } = useAuth()
  const [open, setOpen]         = useState(false)
  const [activePanel, setPanel] = useState(null)
  const [sheetOpen, setSheet]   = useState(false)
  const triggerRef  = useRef(null)
  const dropdownRef = useRef(null)
  const navigate    = useNavigate()

  // Derive display name from email (part before @)
  const displayName = currentUser?.email
    ? currentUser.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : MOCK_USER.name
  const displayEmail = currentUser?.email ?? MOCK_USER.email ?? ''
  // Avatar initial
  const initial = displayName.charAt(0).toUpperCase()

  // Live badge counts from localStorage
  const [bookings]   = useLocalStorage('ss_bookings', {})
  const [savedSkills] = useLocalStorage('ss_saved_skills', {})
  const bookingCount = Object.keys(bookings).length
  const savedCount   = Object.values(savedSkills).length
  const followCount  = Object.keys(MOCK_USERS).filter(uid => {
    try { return JSON.parse(localStorage.getItem(`ss_follow_${uid}`)) === true } catch { return false }
  }).length
  const unreadMsgs = DUMMY_MESSAGES.filter(m => m.unread).length

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target) &&
        triggerRef.current  && !triggerRef.current.contains(e.target)
      ) {
        setOpen(false)
        setPanel(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close on Escape
  useEffect(() => {
    function handler(e) {
      if (e.key === 'Escape') { setOpen(false); setPanel(null); setSheet(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function closeAll() {
    setOpen(false)
    setPanel(null)
    setSheet(false)
  }

  function handleLogout() {
    closeAll()
    logout()
    navigate('/login', { replace: true })
  }

  function openPanel(key) {
    setPanel(key)
    setSheet(true)
  }

  const MENU_ITEMS = [
    {
      key: 'bookings', label: 'My Bookings', badge: bookingCount,
      d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    },
    {
      key: 'saved', label: 'Saved Skills', badge: savedCount,
      d: 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z',
    },
    {
      key: 'following', label: 'Following', badge: followCount,
      d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      key: 'messages', label: 'Messages', badge: unreadMsgs,
      d: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
    },
  ]

  const ActivePanel = activePanel ? PANELS[activePanel] : null

  return (
    <>
      {/* ── Avatar trigger ── */}
      <button
        ref={triggerRef}
        onClick={() => { setOpen(v => !v); setPanel(null) }}
        className="relative flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 active:scale-95"
        aria-label="User menu"
      >
        {/* Avatar: real photo for mock user, initial for signed-up users */}
        {currentUser?.email === MOCK_USER.email ? (
          <img src={MOCK_USER.avatar} alt={displayName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-violet-300 dark:ring-violet-600" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-violet-300 dark:ring-violet-600">
            {initial}
          </div>
        )}
        {(bookingCount + unreadMsgs) > 0 && (
          <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-violet-500 rounded-full border-2 border-white dark:border-gray-950" />
        )}
        <svg className={`w-3 h-3 text-gray-400 hidden md:block transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* ── Desktop dropdown ── */}
      <div
        ref={dropdownRef}
        className={`hidden md:block absolute top-full right-0 mt-2 z-[80]
                    transition-all duration-200 origin-top-right
                    ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ minWidth: '14rem' }}
      >
        {!activePanel ? (
          /* Main menu */
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden w-56">
            {/* User header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              {currentUser?.email === MOCK_USER.email ? (
                <img src={MOCK_USER.avatar} alt={displayName} className="w-9 h-9 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-700 flex-shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 ring-2 ring-violet-200 dark:ring-violet-700">
                  {initial}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{displayName}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{displayEmail}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2">
              {MENU_ITEMS.map(item => (
                <button
                  key={item.key}
                  onClick={() => setPanel(item.key)}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300
                             hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-violet-300
                             transition-all duration-150 group"
                >
                  <svg className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
                  </svg>
                  <span className="flex-1 text-left leading-none">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  <svg className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Divider + footer links */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-2">
              <Link
                to="/profile"
                onClick={closeAll}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-700 dark:text-gray-300
                           hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-violet-300
                           transition-all duration-150 group"
              >
                <svg className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-violet-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="leading-none">Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-500 dark:text-red-400
                           hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 group"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="leading-none">Log out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sub-panel */
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden w-72 max-h-[420px] flex flex-col">
            <button
              onClick={() => setPanel(null)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors border-b border-gray-100 dark:border-gray-800"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <ActivePanel onClose={closeAll} />
          </div>
        )}
      </div>

      {/* ── Mobile: avatar triggers bottom sheet ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[80]" onClick={closeAll}>
          {/* Scrim */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl
                       border-t border-gray-100 dark:border-gray-800 animate-sheet-up"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>

            {!activePanel ? (
              <>
                {/* User header */}
                <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                  {currentUser?.email === MOCK_USER.email ? (
                    <img src={MOCK_USER.avatar} alt={displayName} className="w-11 h-11 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-700" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold ring-2 ring-violet-200 dark:ring-violet-700">
                      {initial}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{displayName}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{displayEmail}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="p-3 grid grid-cols-2 gap-2">
                  {MENU_ITEMS.map(item => (
                    <button
                      key={item.key}
                      onClick={() => openPanel(item.key)}
                      className="relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60
                                 border border-gray-100 dark:border-gray-700/60
                                 hover:border-violet-200 dark:hover:border-violet-700/50
                                 hover:bg-violet-50 dark:hover:bg-violet-900/20
                                 active:scale-95 transition-all duration-200"
                    >
                      {item.badge > 0 && (
                        <span className="absolute top-2 right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                      <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.d} />
                      </svg>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex gap-2 px-3 pb-5 pt-1">
                  <Link
                    to="/profile"
                    onClick={closeAll}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold
                               bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                               hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold
                               bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </button>
                </div>
              </>
            ) : (
              /* Mobile sub-panel */
              <div className="flex flex-col max-h-[70vh]">
                <button
                  onClick={() => setPanel(null)}
                  className="flex items-center gap-1.5 px-5 py-3 text-xs text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors border-b border-gray-100 dark:border-gray-800"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <div className="flex-1 overflow-y-auto pb-6">
                  <ActivePanel onClose={closeAll} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

