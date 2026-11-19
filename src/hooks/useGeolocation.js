import { useCallback, useEffect, useRef, useState } from 'react'

const errorMessages = {
  1: 'Não foi possível acessar sua localização. Informe a origem manualmente.',
  2: 'Sua localização está indisponível neste momento.',
  3: 'A localização demorou para responder. Tente novamente.',
}

export function useGeolocation() {
  const [coordinates, setCoordinates] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const watchId = useRef(null)

  const handleSuccess = useCallback((position) => {
    setCoordinates({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp,
    })
    setError('')
    setLoading(false)
  }, [])

  const handleError = useCallback((locationError) => {
    setError(errorMessages[locationError.code] || 'Não foi possível obter sua localização.')
    setLoading(false)
  }, [])

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Seu navegador não oferece geolocalização.')
      return
    }
    setLoading(true)
    setError('')
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    })
  }, [handleError, handleSuccess])

  const stopWatching = useCallback(() => {
    if (watchId.current !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
  }, [])

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Seu navegador não oferece geolocalização.')
      return
    }
    stopWatching()
    setLoading(true)
    watchId.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    })
  }, [handleError, handleSuccess, stopWatching])

  useEffect(() => stopWatching, [stopWatching])

  return { coordinates, loading, error, requestLocation, startWatching, stopWatching }
}
