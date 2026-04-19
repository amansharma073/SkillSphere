/**
 * Badge definitions with gradient styles, glow colors, and tooltip descriptions.
 * All badge logic lives here — UI components stay dumb.
 */
export const BADGE_DEFS = {
  pro: {
    key:     'pro',
    icon:    '💼',
    label:   'Pro',
    tooltip: 'Earned 500+ total likes across all skills',
    // Tailwind gradient + glow shadow color (used inline for the glow)
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    glow:     'rgba(99,102,241,0.55)',
    ring:     'ring-indigo-400/40',
    text:     'text-white',
  },
  top: {
    key:     'top',
    icon:    '🏆',
    label:   'Top Contributor',
    tooltip: 'Shared more than 5 skills with the community',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    glow:     'rgba(168,85,247,0.55)',
    ring:     'ring-purple-400/40',
    text:     'text-white',
  },
  popular: {
    key:     'popular',
    icon:    '🔥',
    label:   'Popular',
    tooltip: 'Received more than 200 likes in total',
    gradient: 'from-orange-400 via-rose-500 to-red-500',
    glow:     'rgba(249,115,22,0.55)',
    ring:     'ring-orange-400/40',
    text:     'text-white',
  },
  beginner: {
    key:     'beginner',
    icon:    '⭐',
    label:   'Beginner',
    tooltip: 'Just getting started — shared 2 or fewer skills',
    gradient: 'from-gray-200 via-gray-100 to-slate-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
    glow:     'rgba(148,163,184,0.3)',
    ring:     'ring-gray-300/40 dark:ring-gray-500/40',
    text:     'text-gray-600 dark:text-gray-300',
  },
}

/**
 * Returns an array of badge definition objects for a given user.
 * @param {{ skillsShared: number, totalLikes: number }} user
 * @returns {typeof BADGE_DEFS[keyof typeof BADGE_DEFS][]}
 */
export function getUserBadges({ skillsShared = 0, totalLikes = 0 }) {
  const badges = []

  if (totalLikes > 500)    badges.push(BADGE_DEFS.pro)
  if (skillsShared > 5)    badges.push(BADGE_DEFS.top)
  if (totalLikes > 200)    badges.push(BADGE_DEFS.popular)
  if (skillsShared <= 2 && badges.length === 0) badges.push(BADGE_DEFS.beginner)

  return badges
}
