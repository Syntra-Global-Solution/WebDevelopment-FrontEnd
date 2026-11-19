import { useRef, useState } from 'react'
import { getTrainPredictions, searchTransport } from '../services/transportService'

export function useTransportData() {
  const [filters, setFilters] = useState({ type: '', query: '', direction: '' })
  const [results, setResults] = useState([])
  const [selectedLine, setSelectedLine] = useState(null)
  const [selectedStation, setSelectedStation] = useState('')
  const [predictions, setPredictions] = useState([])
  const [predictionsLoading, setPredictionsLoading] = useState(false)
  const [predictionsError, setPredictionsError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const predictionRequest = useRef(0)

  async function loadPredictions(line, station) {
    const requestId = ++predictionRequest.current
    setPredictions([])
    setPredictionsError('')

    if (!line || !station) {
      setPredictionsLoading(false)
      return
    }

    setPredictionsLoading(true)
    try {
      const data = await getTrainPredictions(line, station)
      if (requestId === predictionRequest.current) {
        setPredictions(data)
      }
    } catch {
      if (requestId === predictionRequest.current) {
        setPredictionsError('Não foi possível calcular as próximas chegadas para esta estação.')
      }
    } finally {
      if (requestId === predictionRequest.current) {
        setPredictionsLoading(false)
      }
    }
  }

  function selectLine(line) {
    const station = line?.stops?.[0] || ''
    setSelectedLine(line || null)
    setSelectedStation(station)
    loadPredictions(line, station)
  }

  function selectStation(station) {
    setSelectedStation(station)
    loadPredictions(selectedLine, station)
  }

  function setFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === 'type' ? { direction: '' } : {}),
    }))
    if (key === 'type') {
      setResults([])
      setSelectedLine(null)
      setSelectedStation('')
      loadPredictions(null, '')
      setSearched(false)
    }
  }

  async function search() {
    setLoading(true)
    setError('')
    try {
      const data = await searchTransport(filters)
      setResults(data)
      selectLine(data[0] || null)
      setSearched(true)
    } catch {
      setError('Não foi possível consultar as linhas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return {
    filters,
    setFilter,
    results,
    selectedLine,
    selectedStation,
    predictions,
    predictionsLoading,
    predictionsError,
    loading,
    searched,
    error,
    search,
    selectLine,
    selectStation,
  }
}
