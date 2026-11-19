import { Accessibility, AlertTriangle, Clock3, Construction, Pencil, Trash2, UsersRound } from 'lucide-react'
import { categoryMeta } from '../../data/demoOccurrences'
import { formatDateTime, occurrenceLocation, sourceLabel } from '../../utils/formatters'
import { Button } from '../ui/Button'

const categoryIcons = {
  accessibility: Accessibility,
  crowding: UsersRound,
  sidewalk: Construction,
  lighting: Construction,
  obstacle: Construction,
}

export function OccurrenceCard({ occurrence, canManage, onEdit, onDelete }) {
  const meta = categoryMeta[occurrence.category] || { label: 'Ocorrência', tone: 'info' }
  const Icon = categoryIcons[occurrence.category] || AlertTriangle
  return (
    <article className="rounded-xl border border-slate/25 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${meta.tone === 'critical' ? 'bg-wine text-white' : meta.tone === 'warning' ? 'bg-rose/35 text-wine' : 'bg-slate/12 text-slate'}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold text-slate">{sourceLabel(occurrence.source_type)}</p>
              <h3 className="font-semibold text-navy">{meta.label}</h3>
            </div>
            {occurrence.source_type === 'demo' ? <span className="rounded-md bg-beige/55 px-2 py-1 text-[11px] font-semibold text-navy">Demonstração</span> : null}
          </div>
          <p className="mt-1 text-sm font-medium text-navy">{occurrenceLocation(occurrence)}</p>
          {occurrence.line ? <p className="text-sm text-slate">{occurrence.line}{occurrence.direction ? ` · ${occurrence.direction}` : ''}</p> : null}
          <p className="mt-2 text-sm leading-relaxed text-slate">{occurrence.description || 'Sem descrição adicional.'}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate"><Clock3 className="size-3.5" aria-hidden="true" /> {formatDateTime(occurrence.created_at)}</p>
        </div>
      </div>
      {canManage ? (
        <div className="mt-4 flex justify-end gap-2 border-t border-beige pt-3">
          <Button type="button" variant="secondary" size="sm" onClick={onEdit}><Pencil className="size-4" aria-hidden="true" /> Editar</Button>
          <Button type="button" variant="ghost" size="sm" className="text-wine" onClick={onDelete}><Trash2 className="size-4" aria-hidden="true" /> Excluir</Button>
        </div>
      ) : null}
    </article>
  )
}
