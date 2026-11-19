import { useContext } from 'react'
import { OccurrencesContext } from '../contexts/contextObjects'

export function useOccurrenceContext() {
  const context = useContext(OccurrencesContext)
  if (!context) throw new Error('useOccurrenceContext deve ser usado dentro de OccurrencesProvider.')
  return context
}
