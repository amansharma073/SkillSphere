import { useState } from 'react'

/**
 * Badge — achievement pill with gradient glow + tooltip.
 *
 * Props:
 *   badge  — full badge def object from BADGE_DEFS
 *   size   — "sm" (card footer) | "md" (profile inline) | "lg" (achievement card)
 *   animate — whether to play the fade-in on mount (default true)
 */
export default function Badge({ badge, size = 'md', animate = true }) {
  const [hovered, setHovered] = useState(false)

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-[11px] gap-1',
    md: 'px-3.5 py-1 text-xs gap-1.5',
    lg: 'px-4 py-1.5 text-sm gap-2',
  }

  const iconSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <span className="relative inline-flex">
      {/* The badge pill */}
      <span
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          boxShadow: hovered
            ? `0 0 0 2px ${badge.glow}, 0 4px 16px ${badge.glow}`
            : `0 2px 8px ${badge.glow}`,
        }}
        className={`
          inline-flex items-center font-semibold rounded-full cursor-default select-none
          bg-gradient-to-r ${badge.gradient} ${badge.text} ${badge.ring}
          ring-1 ring-inset
          hover:scale-105 hover:-translate-y-0.5
          transition-all duration-300 ease-out
          ${animate ? 'animate-fade-in' : ''}
          ${sizeClasses[size]}
        `}
      >
        <span className={iconSize[size]}>{badge.icon}</span>
        <span>{badge.label}</span>
      </span>

      {/* Tooltip */}
      {hovered && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50
                     bg-gray-900 dark:bg-gray-950 text-white text-xs font-medium
                     px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap
                     pointer-events-none animate-fade-in
                     after:content-[''] after:absolute after:top-full after:left-1/2
                     after:-translate-x-1/2 after:border-4 after:border-transparent
                     after:border-t-gray-900 dark:after:border-t-gray-950"
        >
          {badge.tooltip}
        </span>
      )}
    </span>
  )
}
