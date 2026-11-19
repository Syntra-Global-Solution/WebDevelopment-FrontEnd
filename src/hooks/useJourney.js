import { useContext } from 'react'
import { JourneyContext } from '../contexts/contextObjects'

export function useJourney() {
  const context = useContext(JourneyContext)
  if (!context) throw new Error('useJourney deve ser usado dentro de JourneyProvider.')
  return context
}
