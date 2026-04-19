import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import SkillCard from '../components/SkillCard'

const STATS = [
  { value: '10K+', label: 'Active Learners', icon: '👥' },
  { value: '500+', label: 'Skills Shared',   icon: '📚' },
  { value: '10+',  label: 'Categories',      icon: '🎯' },
  { value: '4.9★', label: 'Avg Rating',      icon: '⭐' },
]

const FEATURES = [
  { icon: '🚀', title: 'Learn Fast',        desc: 'Structured skill guides from real practitioners.' },
  { icon: '🤝', title: 'Community Driven',  desc: 'Share, discuss, and grow together.' },
  { icon: '🎨', title: 'Any Skill',         desc: 'From coding to cooking — we have it all.' },
]

export default function Home() {
  const { skills } = useApp()
  const trending = [...skills].sort((a, b) => b.likes - a.likes).slice(0, 6)

  return (
    <div className="w-full overflow-x-hidden">

      {/* ── HERO — full viewport width ── */}
      <section className="relative w-full min-h-[92vh] flex items-center
                          bg-gradient-to-br from-slate-50 via-violet-50/50 to-indigo-50
                          dark:from-gray-950 dark:via-violet-950/20 dark:to-gray-900 overflow-hidden">

        {/* Blobs — positioned relative to viewport */}
        <div className="absolute -top-48 -left-48 w-[700px] h-[700px] bg-violet-300/25 dark:bg-violet-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-48 -right-24 w-[600px] h-[600px] bg-indigo-300/25 dark:bg-indigo-700/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-purple-200/10 dark:bg-purple-900/5 rounded-full blur-3xl pointer-events-none" />

        {/* Content — padded, not max-width capped */}
        <div className="relative w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-20">
          <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

            {/* Left — Text */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-sm font-medium px-4 py-2 rounded-full mb-8 ring-1 ring-violet-200 dark:ring-violet-700/50">
                <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                Join 10,000+ learners worldwide
                <span className="text-violet-400">✦</span>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                Share Your{' '}
                <span className="relative inline-block">
                  <span className="text-gradient">Skills,</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8 Q75 2 150 8 Q225 14 298 8" stroke="url(#ul)" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="ul" x1="0" y1="0" x2="300" y2="0">
                        <stop offset="0%" stopColor="#7c3aed"/>
                        <stop offset="100%" stopColor="#4f46e5"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Learn </span>
                <span className="text-gradient">Anything</span>
              </h1>

              <p className="text-lg sm:text-xl xl:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-10">
                SkillSphere connects passionate people who want to teach and learn —
                from <strong className="text-violet-600 dark:text-violet-400">coding</strong> to{' '}
                <strong className="text-indigo-600 dark:text-indigo-400">cooking</strong>,{' '}
                <strong className="text-purple-600 dark:text-purple-400">music</strong> to{' '}
                <strong className="text-violet-600 dark:text-violet-400">fitness</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link to="/explore" className="btn-primary flex items-center justify-center gap-2 text-base">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Explore Skills
                </Link>
                <Link to="/add-skill" className="btn-secondary flex items-center justify-center gap-2 text-base">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Your Skill
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['A','B','C','D','E'].map((l, i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-900 bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {l}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">2,400+</span> joined this week
                </p>
              </div>
            </div>

            {/* Right — Illustration */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xl xl:max-w-2xl">
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 rounded-3xl blur-3xl opacity-20 dark:opacity-25 scale-95" />

                {/* Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-violet-500/10 border border-gray-100 dark:border-gray-700 overflow-hidden animate-float">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=85"
                    alt="People learning together"
                    className="w-full h-80 xl:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-violet-900/65 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-semibold text-xl leading-tight">Learn from the best,</p>
                    <p className="text-violet-200 text-sm mt-1">share what you know.</p>
                  </div>
                </div>

                {/* Badge — top right */}
                <div className="absolute -top-5 -right-5 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-black/10 border border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-green-100 dark:bg-green-900/40 rounded-xl flex items-center justify-center text-lg">🔥</div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">Trending Now</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">React for Beginners</p>
                  </div>
                </div>

                {/* Badge — bottom left */}
                <div className="absolute -bottom-5 -left-5 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-black/10 border border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center text-lg">⭐</div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">4.9 / 5.0</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Community Rating</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR — full bleed ── */}
      <section className="w-full bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-800">
            {STATS.map(({ value, label, icon }) => (
              <div key={label} className="flex flex-col items-center text-center py-4 px-6">
                <span className="text-2xl mb-1">{icon}</span>
                <span className="text-2xl md:text-3xl xl:text-4xl font-extrabold text-gray-900 dark:text-white">{value}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES — full bleed ── */}
      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-20">
        <div className="grid md:grid-cols-3 gap-6 xl:gap-8">
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} className="group p-7 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/60 hover:border-violet-200 dark:hover:border-violet-700/50 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300 hover:-translate-y-1">
              <div className="w-13 h-13 w-12 h-12 bg-violet-50 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRENDING — full bleed with tinted bg ── */}
      <section className="w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/60 dark:to-gray-950 py-20">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🔥</span>
                <span className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Trending</span>
              </div>
              <h2 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                Most Loved Skills
              </h2>
              <span className="block w-16 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full mt-3" />
              <p className="text-gray-600 dark:text-gray-400 mt-3 leading-relaxed text-base xl:text-lg">
                Handpicked by the community — start learning today.
              </p>
            </div>
            <Link
              to="/explore"
              className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold text-sm hover:gap-3 transition-all duration-200 group whitespace-nowrap"
            >
              View all skills
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Cards — 3 cols on lg, 4 on 2xl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
            {trending.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER — full bleed ── */}
      <section className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-20">
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-8 sm:px-16 xl:px-24 py-16 xl:py-20 text-center">
          {/* Blobs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-indigo-300/20 rounded-full blur-2xl animate-pulse" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Start sharing today — it's free
            </div>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white mb-4 leading-tight">
              Have a skill to share?
            </h2>
            <p className="text-violet-100 text-lg xl:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Help thousands of learners grow by sharing what you know. It only takes a few minutes.
            </p>
            <Link
              to="/add-skill"
              className="inline-flex items-center gap-2.5 px-10 py-4 bg-white text-violet-700 font-bold rounded-2xl
                         hover:bg-violet-50 hover:scale-105 hover:shadow-2xl hover:shadow-black/20
                         active:scale-95 transition-all duration-300 text-base shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Share Your Skill
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
