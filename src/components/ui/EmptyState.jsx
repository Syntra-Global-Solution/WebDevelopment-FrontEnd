import { SearchX } from 'lucide-react'

export function EmptyState({ title = 'Não encontramos resultados', description, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate/35 bg-white/60 px-5 py-7 text-center">
      <SearchX className="mx-auto mb-3 size-7 text-slate" aria-hidden="true" />
      <h3 className="font-semibold text-navy">{title}</h3>
      {description ? <p className="mt-1 text-sm leading-relaxed text-slate">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
