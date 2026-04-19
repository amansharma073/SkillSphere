import { useState } from 'react'

/**
 * Large achievement card used in the "Earned Badges" section on Profile.
 * Shows icon, name, and description with a glowing gradient border on hover.
 */
export default function BadgeCard({ badge }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        boxShadow: hovered
          ? `0 0 0 2px ${badge.glow}, 0 8px 32px ${badge.glow}`
          : `0 2px 12px ${badge.glow}`,
      }}
      className="relative group bg-white dark:bg-gray-800/90 rounded-2xl p-5
                 border border-gray-100 dark:border-gray-700/60
                 hover:scale-105 hover:-translate-y-1
                 transition-all duration-300 ease-out cursor-default
                 flex flex-col items-center text-center gap-3 animate-fade-in"
    >
      {/* Gradient glow blob behind icon */}
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.gradient}
                    flex items-center justify-center text-2xl shadow-lg
                    group-hover:scale-110 transition-transform duration-300`}
        style={{ boxShadow: `0 4px 20px ${badge.glow}` }}
      >
        {badge.icon}
      </div>

      {/* Label */}
      <div>
        <p className="font-bold text-gray-900 dark:text-white text-sm">{badge.label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          {badge.tooltip}
        </p>
      </div>

      {/* Subtle gradient shimmer at bottom */}
      <div className={`absolute inset-x-0 bottom-0 h-1 rounded-b-2xl bg-gradient-to-r ${badge.gradient} opacity-60`} />
    </div>
  )
}
