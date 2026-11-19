import { ChevronRight } from 'lucide-react'
import { OperationalStatus } from './OperationalStatus'

export function TransportLineCard({ line, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left focus-visible:outline-2 focus-visible:outline-sage ${selected ? 'border-navy bg-cream' : 'border-slate/25 bg-white'}`}
      onClick={onSelect}
    >
      <div className="min-w-0">
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-slate"><span className="size-2.5 rounded-full" style={{ backgroundColor: line.color }} aria-hidden="true" /> Linha {line.code}</p>
        <p className="truncate font-semibold text-navy">{line.name}</p>
        <p className="mt-1 text-xs text-slate">{line.operator}</p>
        <div className="mt-2"><OperationalStatus status={line.status} kind={line.statusKind} /></div>
      </div>
      <ChevronRight className="size-5 shrink-0 text-slate" aria-hidden="true" />
    </button>
  )
}
