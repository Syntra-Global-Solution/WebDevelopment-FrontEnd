const groups = [
  { value: 'all', label: 'Todas' },
  { value: 'transport', label: 'Transporte' },
  { value: 'accessibility', label: 'Acessibilidade' },
  { value: 'infrastructure', label: 'Infraestrutura' },
  { value: 'recent', label: 'Recentes' },
]

export function OccurrenceFilters({ group, source, onGroupChange, onSourceChange }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Filtrar por categoria">
        {groups.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`min-h-9 shrink-0 rounded-lg border px-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-sage ${group === item.value ? 'border-navy bg-navy text-cream' : 'border-slate/25 bg-white text-slate'}`}
            onClick={() => onGroupChange(item.value)}
            aria-pressed={group === item.value}
          >
            {item.label}
          </button>
        ))}
      </div>
      <label className="flex items-center justify-between gap-3 text-sm font-medium text-navy">
        Origem da informação
        <select className="min-h-10 rounded-lg border border-slate/30 bg-white px-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-sage" value={source} onChange={(event) => onSourceChange(event.target.value)}>
          <option value="all">Todas</option>
          <option value="user">Relatos de usuários</option>
          <option value="official">Informações oficiais</option>
          <option value="demo">Dados demonstrativos</option>
        </select>
      </label>
    </div>
  )
}

