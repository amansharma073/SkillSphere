import { useState, useEffect } from 'react'

/**
 * useState backed by localStorage. Reads initial value from storage,
 * writes back on every change.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage quota exceeded or private mode — fail silently
    }
  }, [key, value])

  return [value, setValue]
}
