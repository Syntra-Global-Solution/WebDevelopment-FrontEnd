import { ListFilter, PlusCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useOccurrenceContext } from '../hooks/useOccurrenceContext'
import { OccurrenceCard } from '../components/occurrences/OccurrenceCard'
import { OccurrenceFilters } from '../components/occurrences/OccurrenceFilters'
import { OccurrenceForm } from '../components/occurrences/OccurrenceForm'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { StatusMessage } from '../components/ui/StatusMessage'
import { filterOccurrences } from '../utils/occurrenceFilters'

export function RelatosPage() {
  const { user } = useAuth()
  const occurrenceState = useOccurrenceContext()
  const [tab, setTab] = useState('register')
  const [group, setGroup] = useState('all')
  const [source, setSource] = useState('all')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [actionError, setActionError] = useState('')

  const filtered = useMemo(
    () => filterOccurrences(occurrenceState.occurrences, group, source),
    [group, occurrenceState.occurrences, source],
  )

  async function handleSave(values) {
    if (!user) throw new Error('Sua sessão expirou. Entre novamente para salvar o relato.')
    if (editing) {
      await occurrenceState.updateOccurrence(editing.id, values)
      setEditing(null)
      setTab('consult')
    } else {
      await occurrenceState.createOccurrence(values, user.id)
      setTab('consult')
    }
  }

  async function confirmDelete() {
    if (!deleting) return
    setActionError('')
    try {
      await occurrenceState.deleteOccurrence(deleting.id)
      setDeleting(null)
    } catch (deleteError) {
      setActionError(deleteError.message)
    }
  }

  return (
    <div className="page-section space-y-5">
      <header>
        <p className="eyebrow">Informação útil, sem rede social</p>
        <h1 className="page-title">Relatos urbanos</h1>
        <p className="page-description">Registre uma condição de mobilidade ou consulte o que já foi informado.</p>
      </header>

      <div className="grid grid-cols-2 rounded-xl bg-beige/40 p-1" role="tablist" aria-label="Opções de relatos">
        <button type="button" role="tab" aria-selected={tab === 'register'} className={`flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold ${tab === 'register' ? 'bg-navy text-cream' : 'text-slate'}`} onClick={() => { setTab('register'); setEditing(null) }}><PlusCircle className="size-4" aria-hidden="true" /> Registrar</button>
        <button type="button" role="tab" aria-selected={tab === 'consult'} className={`flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold ${tab === 'consult' ? 'bg-navy text-cream' : 'text-slate'}`} onClick={() => setTab('consult')}><ListFilter className="size-4" aria-hidden="true" /> Consultar</button>
      </div>

      {occurrenceState.mode === 'demo-session' ? <StatusMessage tone="warning"><strong>Sessão demonstrativa ativa.</strong> Criações, edições e exclusões são locais e serão perdidas ao atualizar a página.</StatusMessage> : null}
      {occurrenceState.error ? <StatusMessage tone="error">{occurrenceState.error}</StatusMessage> : null}

      {tab === 'register' ? (
        <section aria-labelledby="occurrence-form-title">
          <h2 className="section-title mb-3" id="occurrence-form-title">{editing ? 'Editar ocorrência' : 'Registrar ocorrência'}</h2>
          <OccurrenceForm key={editing?.id || 'new'} initialValues={editing} onSave={handleSave} onCancel={editing ? () => setEditing(null) : undefined} saving={occurrenceState.saving} />
        </section>
      ) : (
        <section className="space-y-4" aria-labelledby="occurrence-list-title">
          <h2 className="section-title" id="occurrence-list-title">Consultar relatos</h2>
          <OccurrenceFilters group={group} source={source} onGroupChange={setGroup} onSourceChange={setSource} />
          {occurrenceState.loading ? <LoadingState label="Carregando relatos…" /> : null}
          {!occurrenceState.loading && !filtered.length ? <EmptyState description="Altere os filtros ou registre uma ocorrência." /> : null}
          {filtered.map((occurrence) => (
            <OccurrenceCard
              key={occurrence.id}
              occurrence={occurrence}
              canManage={Boolean(user && occurrence.user_id === user.id)}
              onEdit={() => { setEditing(occurrence); setTab('register') }}
              onDelete={() => setDeleting(occurrence)}
            />
          ))}
        </section>
      )}

      {actionError ? <StatusMessage tone="error">{actionError}</StatusMessage> : null}
      <ConfirmDialog open={Boolean(deleting)} onClose={() => setDeleting(null)} onConfirm={confirmDelete} loading={occurrenceState.saving} title="Excluir este relato?">
        {occurrenceState.mode === 'demo-session'
          ? 'O relato será removido somente desta sessão demonstrativa.'
          : 'O relato será removido da lista e do mapa colaborativo após a confirmação do Supabase.'}
      </ConfirmDialog>
    </div>
  )
}
