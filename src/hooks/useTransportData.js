import { useState } from 'react'
import { searchTransport } from '../services/transportService'

export function useTransportData() {
  const [filters, setFilters] = useState({ type: '', query: '', direction: '' })
  const [results, setResults] = useState([])
  const [selectedLine, setSelectedLine] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')

  function setFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === 'type' ? { direction: '' } : {}),
    }))
    if (key === 'type') {
      setResults([])
      setSelectedLine(null)
      setSearched(false)
    }
  }

  async function search() {
    setLoading(true)
    setError('')
    try {
      const data = await searchTransport(filters)
      setResults(data)
      setSelectedLine(data[0] || null)
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
    loading,
    searched,
    error,
    search,
    selectLine: setSelectedLine,
  }
}
