import { useCallback, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { AuthContext } from './contextObjects'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [demoUser, setDemoUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let active = true
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) setError('Não foi possível recuperar sua sessão.')
      setSession(data.session)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (nextSession) setDemoUser(null)
      setLoading(false)
      if (nextSession) setIsLoginOpen(false)
    })

    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  async function signIn(email, password) {
    if (!supabase) {
      throw new Error('O Supabase ainda não foi configurado neste ambiente.')
    }
    setError('')
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      const message = signInError.message.toLowerCase().includes('invalid')
        ? 'E-mail ou senha inválidos.'
        : 'Não foi possível entrar. Tente novamente.'
      setError(message)
      throw new Error(message)
    }
    setSession(data.session)
    setDemoUser(null)
    setIsLoginOpen(false)
  }

  const signOut = useCallback(async () => {
    if (demoUser) {
      setDemoUser(null)
      return
    }
    if (!supabase) return
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) throw new Error('Não foi possível sair agora.')
    setSession(null)
  }, [demoUser])

  function signInDemo() {
    setDemoUser({
      id: 'demo-user',
      email: 'visitante@demo.syntra',
      user_metadata: { display_name: 'Visitante demonstrativo' },
    })
    setError('')
    setIsLoginOpen(false)
  }

  const value = useMemo(
    () => ({
      user: session?.user || demoUser,
      session,
      isDemoSession: Boolean(demoUser),
      loading,
      error,
      isConfigured: isSupabaseConfigured,
      isLoginOpen,
      openLogin: () => setIsLoginOpen(true),
      closeLogin: () => {
        setError('')
        setIsLoginOpen(false)
      },
      signIn,
      signInDemo,
      signOut,
    }),
    [session, demoUser, loading, error, isLoginOpen, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
