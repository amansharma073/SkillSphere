import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data/mockData'

const INITIAL = { title: '', description: '', category: '', image: '' }

const TIPS = [
  { icon: '✍️', text: 'Be specific — "React Hooks" beats "Coding"' },
  { icon: '📸', text: 'Add an image to get 3× more views' },
  { icon: '📝', text: 'Write at least 2–3 sentences in your description' },
]

export default function AddSkill() {
  const { addSkill } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Skill title is required'
    else if (form.title.trim().length < 3) e.title = 'Title must be at least 3 characters'
    if (!form.description.trim()) e.description = 'Description is required'
    else if (form.description.trim().length < 20) e.description = 'Description must be at least 20 characters'
    if (!form.category) e.category = 'Please select a category'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    addSkill(form)
    toast.success('Skill published successfully! 🎉', {
      style: { fontWeight: '600', borderRadius: '12px' },
    })
    setForm(INITIAL)
    setSubmitting(false)
    navigate('/explore')
  }

  const cats = CATEGORIES.filter((c) => c !== 'All')
  const progress = [form.title, form.description, form.category].filter(Boolean).length

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header strip — full bleed */}
      <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-10">
          <div className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Skill
          </div>
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-extrabold text-gray-900 dark:text-white mb-2">
            Share Your Knowledge
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base xl:text-lg">
            Help the community grow by sharing a skill you're passionate about.
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="w-full px-6 sm:px-10 lg:px-16 xl:px-24 py-10">
        <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-10">

          {/* Form — takes 2/3 on lg, 3/4 on xl */}
          <div className="lg:col-span-2 xl:col-span-3">
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(progress / 3) * 100}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {progress}/3 required
              </span>
            </div>

            <form onSubmit={handleSubmit} noValidate
              className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 md:p-8 xl:p-10 shadow-sm border border-gray-100 dark:border-gray-700/60 space-y-6">

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Skill Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. React for Beginners"
                  className={`w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm ${
                    errors.title ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
                {errors.title && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Category chips */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {cats.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setForm(p => ({ ...p, category: c })); if (errors.category) setErrors(p => ({ ...p, category: '' })) }}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        form.category === c
                          ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe what people will learn from this skill. Be specific and engaging..."
                  className={`w-full px-4 py-3.5 rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 resize-none text-sm leading-relaxed ${
                    errors.description ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
                <div className="flex justify-between mt-1.5">
                  {errors.description ? (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                      {errors.description}
                    </p>
                  ) : <span />}
                  <span className={`text-xs font-medium ${form.description.length >= 20 ? 'text-green-500' : 'text-gray-400'}`}>
                    {form.description.length} / 20 min
                  </span>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Cover Image URL
                  <span className="ml-2 text-xs font-normal text-gray-400">(optional)</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                {form.image && (
                  <div className="mt-3 rounded-xl overflow-hidden h-48 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500
                           disabled:opacity-60 disabled:cursor-not-allowed
                           text-white font-bold rounded-xl transition-all duration-300
                           shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98]
                           flex items-center justify-center gap-2 text-base"
              >
                {submitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Publish Skill
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>💡</span> Tips for a great post
              </h3>
              <ul className="space-y-4">
                {TIPS.map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{text}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-violet-100 dark:border-violet-800/30">
              <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">🌟 Did you know?</p>
              <p className="text-sm text-violet-600/80 dark:text-violet-400/80 leading-relaxed">
                Skills with images get <strong>3× more</strong> engagement from the community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
