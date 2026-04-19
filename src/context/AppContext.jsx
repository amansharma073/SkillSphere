import { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_SKILLS } from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [skills, setSkills] = useState(MOCK_SKILLS)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const addSkill = (skill) => {
    const newSkill = {
      ...skill,
      id: Date.now().toString(),
      userId: 'u1',
      userName: 'Alex Johnson',
      likes: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setSkills((prev) => [newSkill, ...prev])
    return newSkill
  }

  return (
    <AppContext.Provider value={{ skills, addSkill, darkMode, setDarkMode }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
