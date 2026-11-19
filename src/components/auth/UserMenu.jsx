import { LogIn, LogOut, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function UserMenu() {
  const { user, loading, openLogin, signOut, isDemoSession } = useAuth()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const menuRef = useRef(null)

  useEffect(() => {
    function handleOutside(event) {
      if (!menuRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handleOutside)
    return () => document.removeEventListener('pointerdown', handleOutside)
  }, [])

  if (!user) {
    return (
      <button
        type="button"
        className="inline-flex min-h-10 items-center gap-2 rounded-lg px-2.5 text-sm font-semibold text-cream hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-sage disabled:opacity-60"
        onClick={openLogin}
        disabled={loading}
      >
        <LogIn className="size-5" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Entrar</span>
      </button>
    )
  }

  async function handleSignOut() {
    try {
      await signOut()
      setOpen(false)
    } catch (signOutError) {
      setError(signOutError.message)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button type="button" className="grid size-10 place-items-center rounded-lg text-cream hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-sage" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label="Abrir menu do perfil">
        <UserRound className="size-5" aria-hidden="true" />
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-[1100] w-64 rounded-xl border border-beige bg-cream p-3 text-navy shadow-lg">
          <p className="text-xs font-semibold text-slate">Conectado como</p>
          <p className="mt-1 truncate text-sm font-semibold">{user.email}</p>
          {isDemoSession ? <p className="mt-1 text-xs font-semibold text-wine">Sessão demonstrativa</p> : null}
          {error ? <p className="mt-2 text-xs text-wine" role="alert">{error}</p> : null}
          <button type="button" className="mt-3 flex min-h-10 w-full items-center gap-2 rounded-lg px-2 text-sm font-semibold hover:bg-beige/35" onClick={handleSignOut}>
            <LogOut className="size-4" aria-hidden="true" /> Sair
          </button>
        </div>
      ) : null}
    </div>
  )
}
