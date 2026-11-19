import { createContext } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useOccurrences } from '../hooks/useOccurrences'

export const OccurrencesContext = createContext(null)

export function OccurrencesProvider({ children }) {
  const { isDemoSession } = useAuth()
  const value = useOccurrences(isDemoSession)
  return <OccurrencesContext.Provider value={value}>{children}</OccurrencesContext.Provider>
}
