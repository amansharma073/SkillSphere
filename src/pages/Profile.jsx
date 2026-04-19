import { useApp } from '../context/AppContext'
import { MOCK_USER } from '../data/mockData'
import { getUserBadges } from '../utils/badges'
import Badge from '../components/Badge'
import BadgeCard from '../components/BadgeCard'
import SkillCard from '../components/SkillCard'

export default function Profile() {
  const { skills } = useApp()
  const userSkills = skills.filter((s) => s.userId === 'u1')

  const liveUser = {
    ...MOCK_USER,
    skillsShared: userSkills.length,
    totalLikes: userSkills.reduce((sum, s) => sum + (s.likes || 0), 0),
  }

  const badges = getUserBadges(liveUser)

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Cover banner */}
      <div className="w-full h-48 md:h-64 xl:h-72 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -top-16 right-32 w-48 h-48 bg-indigo-300/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-purple-400/10 rounded-full blur-2xl" />
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24">

        {/* Profile card */}
        <div className="relative -mt-20 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 xl:p-10 shadow-xl shadow-black/5 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 xl:w-28 xl:h-28 rounded-2xl ring-4 ring-white dark:ring-gray-800 shadow-lg overflow-hidden">
                  <img src={liveUser.avatar} alt={liveUser.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                {/* Name row */}
                <h1 className="text-2xl xl:text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                  {liveUser.name}
                </h1>

                {/* Inline badges with tooltips */}
                {badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-3">
                    {badges.map((b) => (
                      <Badge key={b.key} badge={b} size="md" />
                    ))}
                  </div>
                )}

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm xl:text-base max-w-2xl">
                  {liveUser.bio}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-8 mt-5">
                  {[
                    { value: liveUser.skillsShared, label: 'Skills Shared' },
                    { value: liveUser.totalLikes,   label: 'Total Likes' },
                    { value: liveUser.joinedAt,     label: 'Joined' },
                  ].map(({ value, label }) => (
                    <div key={label} className="text-center sm:text-left">
                      <div className="text-xl xl:text-2xl font-extrabold text-gray-900 dark:text-white">{value}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Edit */}
              <button className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:border-violet-400 dark:hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all duration-200">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* ── Earned Badges section ── */}
        {badges.length > 0 && (
          <div className="mb-10 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-700/60">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-sm shadow-md shadow-violet-500/30">
                🎖️
              </div>
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-base">Earned Badges</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {badges.length} achievement{badges.length !== 1 ? 's' : ''} unlocked — hover for details
                </p>
              </div>
            </div>

            {/* Badge cards grid */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {badges.map((b) => (
                <BadgeCard key={b.key} badge={b} />
              ))}
            </div>
          </div>
        )}

        {/* Skills grid */}
        <div className="pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl xl:text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              Skills Shared
              <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
                {userSkills.length}
              </span>
            </h2>
          </div>

          {userSkills.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="text-5xl mb-4">📚</div>
              <p className="font-semibold text-gray-700 dark:text-gray-300 text-lg">No skills shared yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
                Start sharing your knowledge with the community!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 xl:gap-8">
              {userSkills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
