import { useState, useEffect } from 'react'
import { MOCK_USERS, MOCK_SKILLS } from '../data/mockData'
import { getUserBadges } from '../utils/badges'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Badge from './Badge'

const STAR_RATINGS = { u1: 4.9, u2: 4.7, u3: 4.6, u4: 4.8, u5: 4.7 }

function StarRating({ rating }) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i <= full ? 'text-amber-400'
            : i === full + 1 && half ? 'text-amber-300'
            : 'text-gray-200 dark:text-gray-700'
          }`}
          fill="currentColor" viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{rating}</span>
      <span className="text-xs text-gray-400 dark:text-gray-500">/ 5.0</span>
    </div>
  )
}

function MessageModal({ instructor, onClose }) {
  const [msg, setMsg] = useState('')
  const [sent, setSent] = useState(false)

  function send() {
    if (!msg.trim()) return
    setSent(true)
    setTimeout(onClose, 1800)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6
                   border border-gray-100 dark:border-gray-700 animate-modal-in"
        onClick={e => e.stopPropagation()}
      >
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-4 animate-success-pop">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-2xl">✉️</div>
            <p className="font-bold text-green-600 dark:text-green-400">Message sent!</p>
            <p className="text-xs text-gray-400">Closing…</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-gray-900 dark:text-white text-sm">Message {instructor}</p>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              placeholder={`Hi ${instructor}, I'd love to learn more about your skill…`}
              rows={4}
              className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800
                         text-gray-800 dark:text-gray-200 p-3 resize-none focus:outline-none
                         focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 transition-all"
            />
            <button
              onClick={send}
              disabled={!msg.trim()}
              className="mt-3 w-full py-2.5 rounded-xl font-semibold text-sm bg-violet-600 hover:bg-violet-700
                         text-white active:scale-95 transition-all duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send Message
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function InstructorProfile({ userId, onClose, onOpenSkill }) {
  const [visible, setVisible]       = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [followed, setFollowed]     = useLocalStorage(`ss_follow_${userId}`, false)
  const [hoveredSkill, setHoveredSkill] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  const user = MOCK_USERS[userId]
  if (!user) return null

  const badges    = getUserBadges(user)
  const rating    = STAR_RATINGS[userId] ?? 4.5
  const userSkills = MOCK_SKILLS.filter(s => s.userId === userId)

  return (
    <>
      <div className="fixed inset-0 z-[60] flex justify-end" onClick={handleClose}>
        {/* Overlay */}
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} />

        {/* Slide panel */}
        <div
          className={`relative h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl
                      flex flex-col overflow-hidden border-l border-gray-100 dark:border-gray-800
                      transition-transform duration-300 ease-out
                      ${visible ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Gradient header */}
          <div className="relative h-28 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 flex-shrink-0">
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/35 text-white
                         flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <p className="absolute bottom-3 left-5 text-white/70 text-xs font-semibold uppercase tracking-widest">Instructor Profile</p>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            {/* Avatar + rating */}
            <div className="-mt-10 mb-4 flex items-end justify-between">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-900 shadow-xl"
              />
              <div className="mb-1"><StarRating rating={rating} /></div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{user.name}</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Member since {user.joinedAt}</p>

            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {badges.map(b => <Badge key={b.key} badge={b} size="sm" />)}
              </div>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-5">{user.bio}</p>

            {/* Follow + Message */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFollowed(v => !v)}
                className={`ripple-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                            text-xs font-semibold active:scale-95 transition-all duration-200 border
                            ${followed
                              ? 'bg-violet-600 hover:bg-violet-700 text-white border-violet-600 shadow-md shadow-violet-500/25'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600'
                            }`}
              >
                <svg className="w-3.5 h-3.5" fill={followed ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {followed ? 'Following ✔' : 'Follow'}
              </button>

              <button
                onClick={() => setShowMessage(true)}
                className="ripple-btn flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                           text-xs font-semibold active:scale-95 transition-all duration-200
                           bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                           border border-gray-200 dark:border-gray-700
                           hover:border-violet-300 dark:hover:border-violet-600"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Message
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-3 text-center border border-violet-100 dark:border-violet-800/30">
                <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">{user.skillsShared}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Skills Shared</p>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-3 text-center border border-rose-100 dark:border-rose-800/30">
                <p className="text-2xl font-extrabold text-rose-500 dark:text-rose-400">{user.totalLikes}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Likes</p>
              </div>
            </div>

            {/* Skills list */}
            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Skills Offered</p>
            <div className="flex flex-col gap-2.5">
              {userSkills.map(s => (
                <button
                  key={s.id}
                  onClick={() => { handleClose(); setTimeout(() => onOpenSkill?.(s), 310) }}
                  onMouseEnter={() => setHoveredSkill(s.id)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left w-full
                              border transition-all duration-200
                              ${hoveredSkill === s.id
                                ? 'border-violet-300 dark:border-violet-600 bg-violet-50 dark:bg-violet-900/20 scale-[1.02] shadow-md shadow-violet-100/50 dark:shadow-violet-900/20'
                                : 'border-gray-100 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/60'
                              }`}
                >
                  <img src={s.image} alt={s.title} className="w-11 h-11 rounded-xl object-cover flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{s.title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.category} · ❤️ {s.likes}</p>
                  </div>
                  <svg className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${hoveredSkill === s.id ? 'text-violet-500 translate-x-0.5' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showMessage && (
        <MessageModal instructor={user.name} onClose={() => setShowMessage(false)} />
      )}
    </>
  )
}
