import { useAuth } from '../hooks/useAuth'
import { useOccurrences } from '../hooks/useOccurrences'
import { OccurrencesContext } from './contextObjects'

export function OccurrencesProvider({ children }) {
  const { isDemoSession } = useAuth()
  const value = useOccurrences(isDemoSession)
  return <OccurrencesContext.Provider value={value}>{children}</OccurrencesContext.Provider>
}
