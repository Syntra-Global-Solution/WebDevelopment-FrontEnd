import { Flag, Navigation } from 'lucide-react'
import { useEffect } from 'react'
import { useGeolocation } from '../../hooks/useGeolocation'
import { formatDistance, formatDuration } from '../../utils/formatters'
import { MapCanvas } from '../map/MapCanvas'
import { Button } from '../ui/Button'
import { StatusMessage } from '../ui/StatusMessage'

function stepLabel(step) {
  if (step.instruction) return step.instruction
  const road = step.name ? ` em ${step.name}` : ''
  const type = step.maneuver?.type
  if (type === 'arrive') return 'Chegue ao destino'
  if (type === 'depart') return `Inicie o trajeto${road}`
  if (type === 'turn') return `Vire e siga${road}`
  return `Continue${road}`
}

export function ActiveJourney({ route, origin, destination, onStop }) {
  const { coordinates, loading, error, startWatching, stopWatching } = useGeolocation()

  useEffect(() => {
    startWatching()
    return stopWatching
  }, [startWatching, stopWatching])

  return (
    <div className="absolute inset-0 z-[1150] flex flex-col bg-cream" role="dialog" aria-modal="true" aria-labelledby="journey-title">
      <header className="flex items-center justify-between bg-navy px-4 py-3 text-cream">
        <div>
          <p className="text-xs text-cream/70">Acompanhamento simplificado</p>
          <h2 className="font-bold" id="journey-title">Trajeto em andamento</h2>
        </div>
        <Button type="button" variant="danger" size="xs" onClick={onStop}>Encerrar</Button>
      </header>
      <MapCanvas route={route} origin={origin} destination={destination} currentLocation={coordinates} className="h-[42%] rounded-none border-x-0" label="Mapa do trajeto em andamento" />
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-white p-3"><p className="text-xs text-slate">Tempo estimado</p><p className="font-bold text-navy">{formatDuration(route.duration)}</p></div>
          <div className="rounded-lg bg-white p-3"><p className="text-xs text-slate">Caminhada</p><p className="font-bold text-navy">{formatDistance(route.walkingDistance)}</p></div>
        </div>
        {loading ? <StatusMessage>Buscando sua localização…</StatusMessage> : null}
        {error ? <StatusMessage tone="warning">{error} O trajeto continua disponível sem acompanhamento de posição.</StatusMessage> : null}
        <section aria-labelledby="steps-title">
          <h3 className="font-semibold text-navy" id="steps-title">Etapas</h3>
          <ol className="mt-3 space-y-3">
            {route.steps.map((step, index) => (
              <li className="flex gap-3 text-sm" key={`${step.mode}-${step.lineId || 'step'}-${index}`}>
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-sage/25 font-semibold text-navy">{index + 1}</span>
                <div><p className="font-medium text-navy">{stepLabel(step)}</p>{step.distance > 0 ? <p className="text-xs text-slate">{formatDistance(step.distance)}</p> : null}</div>
              </li>
            ))}
            <li className="flex gap-3 text-sm"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-wine text-white"><Flag className="size-4" aria-hidden="true" /></span><p className="pt-1 font-medium text-navy">Destino</p></li>
          </ol>
        </section>
        {coordinates ? <p className="inline-flex items-center gap-2 text-xs text-slate"><Navigation className="size-3.5" aria-hidden="true" /> Precisão aproximada de {Math.round(coordinates.accuracy)} m</p> : null}
      </div>
    </div>
  )
}
