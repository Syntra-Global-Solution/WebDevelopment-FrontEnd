import { Clock3, Users } from 'lucide-react'
import { FormField, inputClass } from '../ui/FormField'
import { LoadingState } from '../ui/LoadingState'
import { StatusMessage } from '../ui/StatusMessage'

const crowdStyles = {
  low: 'bg-sage/20 text-navy',
  moderate: 'bg-beige/45 text-navy',
  high: 'bg-rose/35 text-wine',
  full: 'bg-wine text-white',
}

export function TrainPredictions({ line, station, predictions, loading, error, onStationChange }) {
  return (
    <section className="space-y-3 border-t border-beige pt-4" aria-labelledby="train-predictions-title">
      <div>
        <h3 className="text-base font-bold text-navy" id="train-predictions-title">Próximos trens</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate">Selecione a estação para atualizar as previsões.</p>
      </div>

      <FormField id="prediction-station" label="Estação">
        <select id="prediction-station" className={inputClass} value={station} onChange={(event) => onStationChange(event.target.value)}>
          {line.stops.map((stop) => <option value={stop} key={stop}>{stop}</option>)}
        </select>
      </FormField>

      <StatusMessage tone="info">
        Estimativas simuladas com base na linha, estação e horário da consulta. Não representam dados em tempo real da operadora.
      </StatusMessage>

      {loading ? <LoadingState label="Calculando próximas chegadas…" /> : null}
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}

      {!loading && !error && predictions.length ? (
        <div className="grid gap-3 sm:grid-cols-2" aria-live="polite">
          {predictions.map((prediction, index) => (
            <article className="rounded-lg border border-slate/25 bg-cream/45 p-3" key={prediction.id}>
              <p className="text-xs font-semibold text-slate">{index === 0 ? 'Próximo trem' : 'Segundo próximo trem'}</p>
              <p className="mt-1 text-lg font-bold text-navy">{prediction.minutesUntilArrival} min</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-slate">Horário previsto</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 font-semibold text-navy">
                    <Clock3 className="size-4" aria-hidden="true" /> {prediction.arrivalTime}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate">Lotação estimada</p>
                  <span className={`mt-1 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${crowdStyles[prediction.crowding.key] || crowdStyles.moderate}`}>
                    <Users className="size-3.5" aria-hidden="true" /> {prediction.crowding.label}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {!loading && !error && !predictions.length ? <StatusMessage tone="warning">Não há previsões disponíveis para esta estação.</StatusMessage> : null}
    </section>
  )
}
