import { AlertTriangle, Check, Footprints, GitCompareArrows, Map, Play, TrainFront } from 'lucide-react'
import { formatDistance, formatDuration } from '../../utils/formatters'
import { Button } from '../ui/Button'

export function RouteCard({ route, selected, comparing, onSelect, onCompare, onStart }) {
  return (
    <article className={`rounded-xl border bg-white p-4 transition-colors ${selected ? 'border-navy ring-2 ring-sage/35' : 'border-slate/25'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-1.5">
            {route.badges.length ? route.badges.map((badge) => <span key={badge} className="rounded-md bg-sage/20 px-2 py-1 text-xs font-semibold text-navy">{badge}</span>) : <span className="text-xs font-semibold text-slate">Rota sobre trilhos</span>}
          </div>
          <p className="mt-2 text-2xl font-bold text-navy">{formatDuration(route.duration)}</p>
        </div>
        {selected ? <Check className="size-5 text-sage" aria-label="Rota selecionada" /> : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Linhas utilizadas">
        {route.lines.map((line) => (
          <span key={line.id} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-white" style={{ backgroundColor: line.color }}>
            <TrainFront className="size-3.5" aria-hidden="true" /> {line.shortName}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate">
        <span className="inline-flex items-center gap-1.5"><Footprints className="size-4" aria-hidden="true" /> {formatDistance(route.walkingDistance)}</span>
        <span>{route.transfers} {route.transfers === 1 ? 'baldeação' : 'baldeações'}</span>
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-lg bg-cream px-3 py-2 text-xs leading-relaxed text-slate">
        <AlertTriangle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        Embarque em {route.boardingStation} e desembarque em {route.alightingStation}. {route.nearbyOccurrences ? `${route.nearbyOccurrences} relato(s) a até 300 m do caminho.` : 'Nenhum relato mapeado a até 300 m do caminho.'}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button type="button" variant="secondary" size="sm" onClick={onSelect}>
          <Map className="size-4" aria-hidden="true" /> Ver no mapa
        </Button>
        <Button type="button" variant={comparing ? 'sage' : 'secondary'} size="sm" onClick={onCompare} aria-pressed={comparing}>
          <GitCompareArrows className="size-4" aria-hidden="true" /> Comparar
        </Button>
        <Button type="button" className="col-span-2" size="sm" onClick={onStart}>
          <Play className="size-4" aria-hidden="true" /> Iniciar trajeto
        </Button>
      </div>
    </article>
  )
}
