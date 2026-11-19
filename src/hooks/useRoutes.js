import { useCallback, useEffect, useRef, useState } from 'react'
import { initialPreferences, preferenceGroups } from '../data/mobilityPreferences'
import { geocodePlace } from '../services/geocodingService'
import { planRailJourneys } from '../services/railRoutingService'
import { rankRoutes } from '../utils/routeScoring'

const initialLocation = { text: '', place: null }

export function useRoutes(occurrences = []) {
  const [origin, setOrigin] = useState(initialLocation)
  const [destination, setDestination] = useState(initialLocation)
  const [preferences, setPreferences] = useState(initialPreferences)
  const [routes, setRoutes] = useState([])
  const [selectedRouteId, setSelectedRouteId] = useState(null)
  const [comparisonIds, setComparisonIds] = useState([])
  const [activeRouteId, setActiveRouteId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const controllerRef = useRef(null)

  useEffect(() => () => controllerRef.current?.abort(), [])

  function updateLocation(setter, text) {
    setter((current) => ({ text, place: text === current.place?.label ? current.place : null }))
  }

  function togglePreference(id) {
    const item = preferenceGroups.flatMap((group) => group.items).find((option) => option.id === id)
    setPreferences((current) => {
      const next = { ...current, [id]: !current[id] }
      if (next[id] && item?.exclusiveWith) next[item.exclusiveWith] = false
      return next
    })
  }

  async function searchRoutes() {
    if (!origin.text.trim()) {
      setError('Informe a origem ou use sua localização atual.')
      return
    }
    if (!destination.text.trim()) {
      setError('Informe o destino antes de buscar trajetos.')
      return
    }

    controllerRef.current?.abort()
    controllerRef.current = new AbortController()
    setLoading(true)
    setError('')
    setRoutes([])
    try {
      const originPlace = origin.place || (await geocodePlace(origin.text, controllerRef.current.signal))
      const destinationPlace = destination.place || (await geocodePlace(destination.text, controllerRef.current.signal))
      setOrigin({ text: origin.text, place: originPlace })
      setDestination({ text: destination.text, place: destinationPlace })
      const results = await planRailJourneys(originPlace, destinationPlace, controllerRef.current.signal)
      const ranked = rankRoutes(results, preferences, occurrences)
      setRoutes(ranked)
      setSelectedRouteId(ranked[0]?.id || null)
      setComparisonIds(ranked.slice(0, 2).map((route) => route.id))
    } catch (requestError) {
      if (requestError.name !== 'AbortError') setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  function swapLocations() {
    setOrigin(destination)
    setDestination(origin)
    setRoutes([])
  }

  const setCurrentOrigin = useCallback((place) => {
    setOrigin({ text: place.label || 'Minha localização', place })
    setRoutes([])
  }, [])

  function toggleComparison(id) {
    setComparisonIds((current) => {
      if (current.includes(id)) return current.filter((routeId) => routeId !== id)
      if (current.length >= 2) return [current[1], id]
      return [...current, id]
    })
  }

  const selectedRoute = routes.find((route) => route.id === selectedRouteId) || null
  const activeRoute = routes.find((route) => route.id === activeRouteId) || null

  return {
    origin,
    destination,
    preferences,
    routes,
    selectedRoute,
    activeRoute,
    comparisonIds,
    loading,
    error,
    setOriginText: (text) => updateLocation(setOrigin, text),
    setDestinationText: (text) => updateLocation(setDestination, text),
    setCurrentOrigin,
    swapLocations,
    togglePreference,
    searchRoutes,
    selectRoute: setSelectedRouteId,
    toggleComparison,
    startRoute: (id) => setActiveRouteId(id),
    stopRoute: () => setActiveRouteId(null),
    clearError: () => setError(''),
  }
}
