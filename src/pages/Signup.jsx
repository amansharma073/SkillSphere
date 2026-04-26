import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function FieldError({ msg }) {
  if (!msg) return null
  return (
    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {msg}
    </p>
  )
}

function StrengthBar({ password }) {
  const score = [/.{6,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-green-500']
  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= score ? colors[score] : 'bg-gray-200 dark:bg-gray-700'}`} />
        ))}
      </div>
      <p className={`text-[10px] font-semibold ${score <= 1 ? 'text-red-400' : score === 2 ? 'text-amber-400' : score === 3 ? 'text-blue-400' : 'text-green-500'}`}>
        {labels[score]}
      </p>
    </div>
  )
}

function validate({ email, password, confirm }) {
  const errs = {}
  if (!email) errs.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.'
  if (!password) errs.password = 'Password is required.'
  else if (password.length < 6) errs.password = 'Password must be at least 6 characters.'
  if (!confirm) errs.confirm = 'Please confirm your password.'
  else if (confirm !== password) errs.confirm = 'Passwords do not match.'
  return errs
}

export default function Signup() {
  const { signup }  = useAuth()
  const navigate    = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '', confirm: '' })
  const [errors, setErrors]   = useState({})
  const [apiError, setApiErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [done, setDone]       = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
    setApiErr('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const result = signup({ email: form.email, password: form.password })
    setLoading(false)
    if (!result.ok) { setApiErr(result.error); return }
    setDone(true)
    setTimeout(() => navigate('/', { replace: true }), 1500)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4
                    bg-gradient-to-br from-slate-50 via-violet-50/40 to-indigo-50
                    dark:from-gray-950 dark:via-violet-950/20 dark:to-gray-900">

      <div className="fixed -top-40 -left-40 w-[500px] h-[500px] bg-violet-300/20 dark:bg-violet-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -right-20 w-[400px] h-[400px] bg-indigo-300/20 dark:bg-indigo-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40
                        border border-gray-100 dark:border-gray-800 overflow-hidden">

          <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

          <div className="px-8 py-8">
            {done ? (
              /* Success state */
              <div className="flex flex-col items-center py-6 gap-4 animate-success-pop">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-3xl shadow-lg ring-4 ring-green-200/50 dark:ring-green-800/30">
                  🎉
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Account created!</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Redirecting you to SkillSphere…</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30 mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create account</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Join SkillSphere — it's free</p>
                </div>

                {apiError && (
                  <div className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 animate-fade-in">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-600 dark:text-red-400">{apiError}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com" autoComplete="email"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800
                                    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                    focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 transition-all duration-200
                                    ${errors.email ? 'border-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                      />
                    </div>
                    <FieldError msg={errors.email} />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type={showPw ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                        placeholder="Min. 6 characters" autoComplete="new-password"
                        className={`w-full pl-10 pr-11 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800
                                    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                    focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 transition-all duration-200
                                    ${errors.password ? 'border-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                      />
                      <button type="button" onClick={() => setShowPw(v => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        {showPw ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <StrengthBar password={form.password} />
                    <FieldError msg={errors.password} />
                  </div>

                  {/* Confirm */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm password</label>
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <input
                        type={showPw ? 'text' : 'password'} name="confirm" value={form.confirm} onChange={handleChange}
                        placeholder="Re-enter password" autoComplete="new-password"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-gray-50 dark:bg-gray-800
                                    text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500
                                    focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 transition-all duration-200
                                    ${errors.confirm ? 'border-red-400 dark:border-red-600' : 'border-gray-200 dark:border-gray-700'}`}
                      />
                    </div>
                    <FieldError msg={errors.confirm} />
                  </div>

                  <button
                    type="submit" disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold text-sm text-white
                               bg-gradient-to-r from-violet-600 to-indigo-600
                               hover:from-violet-500 hover:to-indigo-500
                               shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                               hover:scale-[1.02] active:scale-95 transition-all duration-200
                               disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100
                               flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Creating account…
                      </>
                    ) : 'Create Account'}
                  </button>
                </form>

                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                  <span className="text-xs text-gray-400 dark:text-gray-600">or</span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                </div>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-5">
          Demo only — no real data is transmitted.
        </p>
      </div>
    </div>
  )
}
