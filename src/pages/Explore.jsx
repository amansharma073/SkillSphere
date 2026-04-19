import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/mockData'
import SkillCard from '../components/SkillCard'
import SkeletonCard from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

export default function Explore() {
  const { skills } = useApp()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      const q = search.toLowerCase()
      const matchSearch = !q || s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.userName.toLowerCase().includes(q)
      const matchCat = category === 'All' || s.category === category
      return matchSearch && matchCat
    })
  }, [skills, search, category])

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Page header — full bleed white strip */}
      <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-10">
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-white mb-1">
            Explore Skills
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base xl:text-lg">
            Discover {skills.length}+ skills shared by our community
          </p>

          {/* Search — full width on mobile, capped on large */}
          <div className="relative mt-6 w-full max-w-3xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search skills, categories, or creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-8">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 scale-105'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-600 hover:text-violet-600 dark:hover:text-violet-400 hover:scale-105'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
            {filtered.length === 0
              ? 'No results'
              : `Showing ${filtered.length} skill${filtered.length !== 1 ? 's' : ''}${category !== 'All' ? ` in ${category}` : ''}`}
          </p>
        )}

        {/* Grid — 3 cols lg, 4 cols 2xl */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No skills match your search" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
            {filtered.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
