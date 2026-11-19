export function formatDistance(meters) {
  if (!Number.isFinite(meters)) return 'Indisponível'
  return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1).replace('.', ',')} km`
}

export function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return 'Indisponível'
  const minutes = Math.max(1, Math.round(seconds / 60))
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours}h ${rest}min` : `${hours}h`
}

export function formatDateTime(value) {
  if (!value) return 'Data indisponível'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Data indisponível'
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

export function occurrenceLocation(occurrence) {
  return occurrence.station || occurrence.address || occurrence.line || 'Local não informado'
}

export function sourceLabel(source) {
  if (source === 'official') return 'Informação oficial'
  if (source === 'demo') return 'Dado demonstrativo'
  return 'Relato de usuário'
}
