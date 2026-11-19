import { ExternalLink, Search } from 'lucide-react'
import { transportLines } from '../data/transportData'
import { useTransportData } from '../hooks/useTransportData'
import { OperationalStatus } from '../components/transport/OperationalStatus'
import { TransportLineCard } from '../components/transport/TransportLineCard'
import { TransportSelector } from '../components/transport/TransportSelector'
import { TrainPredictions } from '../components/transport/TrainPredictions'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { FormField, inputClass } from '../components/ui/FormField'
import { LoadingState } from '../components/ui/LoadingState'
import { StatusMessage } from '../components/ui/StatusMessage'

export function LinhasPage() {
  const transport = useTransportData()
  const directions = [...new Set(transportLines.filter((line) => !transport.filters.type || line.type === transport.filters.type).flatMap((line) => line.directions))]

  return (
    <div className="page-section space-y-5">
      <header>
        <p className="eyebrow">Transporte público</p>
        <h1 className="page-title">Consulte linhas</h1>
        <p className="page-description">Consulte linhas, sentidos, operadoras, horários e estações da rede sobre trilhos.</p>
      </header>

      <section className="space-y-4 rounded-xl border border-slate/25 bg-white p-4" aria-label="Pesquisa de linhas">
        <TransportSelector value={transport.filters.type} onChange={(value) => transport.setFilter('type', value)} />
        <FormField id="transport-query" label="Linha ou estação">
          <input id="transport-query" className={inputClass} value={transport.filters.query} onChange={(event) => transport.setFilter('query', event.target.value)} placeholder="Nome, número ou estação" />
        </FormField>
        <FormField id="transport-direction" label="Sentido">
          <select id="transport-direction" className={inputClass} value={transport.filters.direction} onChange={(event) => transport.setFilter('direction', event.target.value)}>
            <option value="">Todos os sentidos</option>
            {directions.map((direction) => <option value={direction} key={direction}>{direction}</option>)}
          </select>
        </FormField>
        <Button type="button" className="w-full" onClick={transport.search} disabled={transport.loading}>
          <Search className="size-4" aria-hidden="true" /> {transport.loading ? 'Consultando…' : 'Consultar'}
        </Button>
      </section>

      {transport.loading ? <LoadingState label="Consultando o catálogo de linhas…" /> : null}
      {transport.error ? <StatusMessage tone="error">{transport.error}</StatusMessage> : null}
      {transport.searched && !transport.loading && !transport.results.length ? <EmptyState description="Revise o nome ou experimente outro tipo de transporte." /> : null}

      {transport.results.length ? (
        <section className="space-y-3" aria-labelledby="line-results-title">
          <h2 className="section-title" id="line-results-title">Resultados</h2>
          {transport.results.map((line) => <TransportLineCard key={line.id} line={line} selected={transport.selectedLine?.id === line.id} onSelect={() => transport.selectLine(line)} />)}
        </section>
      ) : null}

      {transport.selectedLine ? (
        <section className="space-y-4 rounded-xl border border-slate/25 bg-white p-4" aria-labelledby="line-detail-title">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-xs font-semibold text-slate">{transport.selectedLine.code}</p><h2 className="text-lg font-bold text-navy" id="line-detail-title">{transport.selectedLine.name}</h2></div>
            <OperationalStatus status={transport.selectedLine.status} kind={transport.selectedLine.statusKind} />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><p className="text-xs text-slate">Sentidos</p><p className="font-medium text-navy">{transport.selectedLine.directions.join(' / ')}</p></div>
            <div><p className="text-xs text-slate">Funcionamento</p><p className="font-medium text-navy">{transport.selectedLine.operatingHours}</p></div>
            <div><p className="text-xs text-slate">Operadora</p><p className="font-medium text-navy">{transport.selectedLine.operator}</p></div>
            <div><p className="text-xs text-slate">Estações</p><p className="font-medium text-navy">{transport.selectedLine.stops.length}</p></div>
          </div>
          {transport.selectedLine.note ? <StatusMessage tone="warning">{transport.selectedLine.note}</StatusMessage> : null}
          <TrainPredictions
            line={transport.selectedLine}
            station={transport.selectedStation}
            predictions={transport.predictions}
            loading={transport.predictionsLoading}
            error={transport.predictionsError}
            onStationChange={transport.selectStation}
          />
          <details>
            <summary className="cursor-pointer text-sm font-semibold text-navy">Estações</summary>
            <ol className="mt-3 border-l-2 border-sage/50 pl-4 text-sm text-slate">{transport.selectedLine.stops.map((stop) => <li className="relative py-1.5 before:absolute before:-left-[21px] before:top-3 before:size-2 before:rounded-full before:bg-sage" key={stop}>{stop}</li>)}</ol>
          </details>
          <div className="border-t border-beige pt-3 text-xs leading-relaxed text-slate">
            <p>Cadastro atualizado em {transport.selectedLine.updatedAt}.</p>
            <a className="mt-2 inline-flex min-h-9 items-center gap-1.5 font-semibold text-navy underline decoration-sage decoration-2 underline-offset-2" href={transport.selectedLine.sourceUrl} target="_blank" rel="noreferrer">
              Consultar {transport.selectedLine.sourceLabel} <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>
      ) : null}
    </div>
  )
}
