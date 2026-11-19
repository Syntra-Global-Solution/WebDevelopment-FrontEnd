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
    controllerRef.current?.abort()
    controllerRef.current = null
    setLoading(false)
    if (!origin.text.trim()) {
      setError('Informe a origem ou use sua localização atual.')
      return
    }
    if (!destination.text.trim()) {
      setError('Informe o destino antes de buscar trajetos.')
      return
    }

    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError('')
    setRoutes([])
    setSelectedRouteId(null)
    setComparisonIds([])
    try {
      const originPlace = origin.place || (await geocodePlace(origin.text, controller.signal))
      const destinationPlace = destination.place || (await geocodePlace(destination.text, controller.signal))
      if (controller.signal.aborted) return
      setOrigin({ text: origin.text, place: originPlace })
      setDestination({ text: destination.text, place: destinationPlace })
      const results = await planRailJourneys(originPlace, destinationPlace, controller.signal)
      if (controller.signal.aborted) return
      const ranked = rankRoutes(results, preferences, occurrences)
      setRoutes(ranked)
      setSelectedRouteId(ranked[0]?.id || null)
      setComparisonIds(ranked.slice(0, 2).map((route) => route.id))
    } catch (requestError) {
      if (requestError.name !== 'AbortError' && controllerRef.current === controller) {
        setError(requestError.message || 'Não foi possível buscar trajetos. Tente novamente.')
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null
        setLoading(false)
      }
    }
  }

  function swapLocations() {
    setOrigin(destination)
    setDestination(origin)
    setRoutes([])
    setSelectedRouteId(null)
    setComparisonIds([])
    setError('')
  }

  const setCurrentOrigin = useCallback((place) => {
    setOrigin({ text: place.label || 'Minha localização', place })
    setRoutes([])
    setSelectedRouteId(null)
    setComparisonIds([])
    setError('')
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
