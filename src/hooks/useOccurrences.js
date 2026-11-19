import { useCallback, useEffect, useRef, useState } from 'react'
import { demoOccurrences } from '../data/demoOccurrences'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  createOccurrence as createOccurrenceRequest,
  deleteOccurrence as deleteOccurrenceRequest,
  listOccurrences,
  updateOccurrence as updateOccurrenceRequest,
} from '../services/occurrenceService'

export function useOccurrences(isDemoSession = false) {
  const [occurrences, setOccurrences] = useState(isSupabaseConfigured ? [] : demoOccurrences)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const previousDemoSession = useRef(isDemoSession)

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setOccurrences(demoOccurrences)
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      setOccurrences(await listOccurrences())
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined
    let active = true
    listOccurrences()
      .then((data) => {
        if (active) setOccurrences(data)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const wasDemoSession = previousDemoSession.current
    previousDemoSession.current = isDemoSession
    if (wasDemoSession && !isDemoSession) reload()
  }, [isDemoSession, reload])

  async function createOccurrence(values, userId) {
    setSaving(true)
    setError('')
    try {
      if (isDemoSession) {
        const now = new Date().toISOString()
        const created = {
          ...values,
          id: `demo-session-${crypto.randomUUID()}`,
          user_id: userId,
          source_type: 'demo',
          created_at: now,
          updated_at: now,
        }
        setOccurrences((current) => [created, ...current])
        return created
      }
      const created = await createOccurrenceRequest(values, userId)
      setOccurrences((current) => [created, ...current])
      return created
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setSaving(false)
    }
  }

  async function updateOccurrence(id, values) {
    setSaving(true)
    setError('')
    try {
      if (isDemoSession) {
        const existing = occurrences.find((item) => item.id === id && item.user_id === 'demo-user')
        if (!existing) throw new Error('O relato demonstrativo não pertence a esta sessão.')
        const updated = { ...existing, ...values, updated_at: new Date().toISOString() }
        setOccurrences((current) => current.map((item) => (item.id === id ? updated : item)))
        return updated
      }
      const updated = await updateOccurrenceRequest(id, values)
      setOccurrences((current) => current.map((item) => (item.id === id ? updated : item)))
      return updated
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setSaving(false)
    }
  }

  async function deleteOccurrence(id) {
    setSaving(true)
    setError('')
    try {
      if (isDemoSession) {
        const existing = occurrences.find((item) => item.id === id && item.user_id === 'demo-user')
        if (!existing) throw new Error('O relato demonstrativo não pertence a esta sessão.')
        setOccurrences((current) => current.filter((item) => item.id !== id))
        return
      }
      await deleteOccurrenceRequest(id)
      setOccurrences((current) => current.filter((item) => item.id !== id))
    } catch (requestError) {
      setError(requestError.message)
      throw requestError
    } finally {
      setSaving(false)
    }
  }

  return {
    occurrences,
    loading,
    saving,
    error,
    mode: isDemoSession ? 'demo-session' : isSupabaseConfigured ? 'live' : 'demo',
    reload,
    createOccurrence,
    updateOccurrence,
    deleteOccurrence,
    clearError: () => setError(''),
  }
}
