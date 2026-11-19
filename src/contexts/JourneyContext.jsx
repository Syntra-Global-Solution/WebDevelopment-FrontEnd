import { createContext } from 'react'
import { useOccurrenceContext } from '../hooks/useOccurrenceContext'
import { useRoutes } from '../hooks/useRoutes'

export const JourneyContext = createContext(null)

export function JourneyProvider({ children }) {
  const { occurrences } = useOccurrenceContext()
  const value = useRoutes(occurrences)
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}
