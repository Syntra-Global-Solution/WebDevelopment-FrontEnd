import { useOccurrenceContext } from '../hooks/useOccurrenceContext'
import { useRoutes } from '../hooks/useRoutes'
import { JourneyContext } from './contextObjects'

export function JourneyProvider({ children }) {
  const { occurrences } = useOccurrenceContext()
  const value = useRoutes(occurrences)
  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}
