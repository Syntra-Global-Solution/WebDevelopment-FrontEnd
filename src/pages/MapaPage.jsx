import { MapPinned } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useOccurrenceContext } from '../hooks/useOccurrenceContext'
import { MapCanvas } from '../components/map/MapCanvas'
import { OccurrenceFilters } from '../components/occurrences/OccurrenceFilters'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { StatusMessage } from '../components/ui/StatusMessage'
import { filterOccurrences } from '../utils/occurrenceFilters'

export function MapaPage() {
  const { occurrences, loading, error } = useOccurrenceContext()
  const [group, setGroup] = useState('all')
  const [source, setSource] = useState('all')
  const filtered = useMemo(() => filterOccurrences(occurrences, group, source), [group, occurrences, source])
  const mapped = filtered.filter((item) => Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)))
  const unmappedCount = filtered.length - mapped.length

  return (
    <div className="page-section space-y-5">
      <header>
        <p className="eyebrow">Visão colaborativa</p>
        <h1 className="page-title">Mapa da mobilidade</h1>
        <p className="page-description">Explore condições relatadas em pontos com localização válida.</p>
      </header>
      <OccurrenceFilters group={group} source={source} onGroupChange={setGroup} onSourceChange={setSource} />
      {loading ? <LoadingState label="Atualizando o mapa…" /> : null}
      {error ? <StatusMessage tone="error">{error}</StatusMessage> : null}
      {!loading && mapped.length ? <MapCanvas occurrences={mapped} className="h-[430px]" label="Mapa colaborativo de ocorrências" /> : null}
      {!loading && !mapped.length ? <EmptyState title="Nenhum marcador neste filtro" description="Relatos sem coordenadas continuam disponíveis na lista." /> : null}
      <div className="rounded-xl border border-slate/25 bg-white p-4 text-sm text-slate">
        <p className="flex items-center gap-2 font-semibold text-navy"><MapPinned className="size-4" aria-hidden="true" /> {mapped.length} marcador(es) visíveis</p>
        {unmappedCount ? <p className="mt-2">{unmappedCount} relato(s) permanecem apenas na lista por não terem localização suficiente.</p> : null}
        <p className="mt-2 text-xs">Clique em um marcador para ver categoria, local, data, descrição e origem da informação.</p>
      </div>
    </div>
  )
}
