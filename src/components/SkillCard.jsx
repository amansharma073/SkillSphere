import Badge from './Badge'
import { getUserBadges } from '../utils/badges'
import { MOCK_USERS } from '../data/mockData'


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

const CATEGORY_EMOJI = {
  Coding: '💻', Music: '🎵', Art: '🎨', Fitness: '💪',
  Cooking: '🍳', Photography: '📷', Design: '✏️', Language: '🌍', Business: '💼',
}

export default function SkillCard({ skill }) {
  const colorClass = CATEGORY_COLORS[skill.category] || 'bg-gray-500/10 text-gray-600 dark:text-gray-400 ring-1 ring-gray-500/20'
  const emoji = CATEGORY_EMOJI[skill.category] || '🎯'

  // Resolve creator's top badge (show only the first / highest-priority one on cards)
  const creator = MOCK_USERS[skill.userId]
  const badges = creator ? getUserBadges(creator) : []
  const topBadge = badges[0] ?? null

  return (
    <div className="group relative bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden
                    shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 dark:hover:shadow-violet-500/5
                    border border-gray-100 dark:border-gray-700/60
                    hover:-translate-y-2 transition-all duration-300 ease-out
                    flex flex-col">

      {/* Image area */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {skill.image ? (
          <img
            src={skill.image}
            alt={skill.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
          />
        ) : null}

        {/* Fallback */}
        <div
          className={`${skill.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-5xl`}
          style={{ display: skill.image ? 'none' : 'flex' }}
        >
          {emoji}
        </div>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm ${colorClass}`}>
            {skill.category}
          </span>
        </div>

        {/* View Details — slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button className="flex items-center gap-1.5 px-5 py-2 bg-white/95 dark:bg-gray-900/95 text-violet-700 dark:text-violet-300 text-sm font-semibold rounded-xl shadow-lg hover:bg-white dark:hover:bg-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Details
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-snug mb-2 line-clamp-1 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors duration-200">
          {skill.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
          {skill.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60">
          {/* Creator info + badge */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 flex-shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {skill.userName.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate leading-tight">
                {skill.userName}
              </span>
              {topBadge && (
                <div className="mt-0.5">
                  <Badge badge={topBadge} size="sm" />
                </div>
              )}
            </div>
          </div>

          {/* Likes */}
          <button className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200 group/like flex-shrink-0">
            <svg className="w-4 h-4 group-hover/like:scale-125 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
            </svg>
            <span className="text-xs font-medium">{skill.likes}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
