import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

// ── helpers ────────────────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem('ss_users')) || [] } catch { return [] }
}
function saveUsers(users) {
  localStorage.setItem('ss_users', JSON.stringify(users))
}
function getSession() {
  try { return JSON.parse(localStorage.getItem('ss_currentUser')) || null } catch { return null }
}

// ── provider ───────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(getSession)

  const signup = useCallback(({ email, password }) => {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const user = { email: email.toLowerCase(), password, createdAt: new Date().toISOString() }
    saveUsers([...users, user])
    const session = { email: user.email, createdAt: user.createdAt }
    localStorage.setItem('ss_currentUser', JSON.stringify(session))
    setCurrentUser(session)
    return { ok: true }
  }, [])

  const login = useCallback(({ email, password }) => {
    const users = getUsers()
    const match = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!match) return { ok: false, error: 'Invalid email or password.' }
    const session = { email: match.email, createdAt: match.createdAt }
    localStorage.setItem('ss_currentUser', JSON.stringify(session))
    setCurrentUser(session)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('ss_currentUser')
    setCurrentUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
