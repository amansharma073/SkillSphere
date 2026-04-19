import { Link } from 'react-router-dom'

export default function EmptyState({ message = 'No skills found', showAdd = true }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{message}</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        Try adjusting your search or filters, or be the first to share this skill!
      </p>
      {showAdd && (
        <Link
          to="/add-skill"
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors"
        >
          Add a Skill
        </Link>
      )}
    </div>
  )
}
