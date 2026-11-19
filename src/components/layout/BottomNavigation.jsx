import { Map, MapPinned, MessageSquareWarning, TrainFront } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/trajetos', label: 'Trajetos', icon: MapPinned },
  { to: '/linhas', label: 'Linhas', icon: TrainFront },
  { to: '/relatos', label: 'Relatos', icon: MessageSquareWarning },
  { to: '/mapa', label: 'Mapa', icon: Map },
]

export function BottomNavigation() {
  return (
    <nav className="z-[1000] grid shrink-0 grid-cols-4 border-t border-beige bg-cream/95 px-1 pb-[max(.35rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur" aria-label="Navegação principal">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-sage ${isActive ? 'bg-navy text-cream' : 'text-slate hover:bg-beige/35 hover:text-navy'}`}
        >
          <Icon className="size-5" strokeWidth={1.9} aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
