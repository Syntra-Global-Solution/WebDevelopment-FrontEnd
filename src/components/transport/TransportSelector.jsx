import { CableCar, Network, TrainFront, TramFront } from 'lucide-react'
import { transportTypes } from '../../data/transportData'

const icons = { all: Network, metro: TramFront, train: TrainFront, monorail: CableCar }

export function TransportSelector({ value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-navy">Tipo de transporte</legend>
      <div className="grid grid-cols-4 gap-2">
        {transportTypes.map((type) => {
          const Icon = icons[type.value || 'all']
          const active = value === type.value
          return (
            <button
              key={type.value}
              type="button"
              className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-lg border px-1 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-sage ${active ? 'border-navy bg-navy text-cream' : 'border-slate/25 bg-white text-slate hover:bg-cream hover:text-navy'}`}
              onClick={() => onChange(type.value)}
              aria-pressed={active}
            >
              <Icon className="size-5" aria-hidden="true" />
              {type.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
