import { ChevronDown } from 'lucide-react'
import { preferenceGroups } from '../../data/mobilityPreferences'

export function MobilityPreferences({ preferences, onToggle, open, onOpenChange }) {
  const selectedCount = Object.values(preferences).filter(Boolean).length

  return (
    <section className="rounded-xl border border-slate/25 bg-white" aria-labelledby="preferences-title">
      <button
        type="button"
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left focus-visible:outline-2 focus-visible:outline-sage"
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls="travel-preferences-panel"
      >
        <span>
          <span className="block text-sm font-semibold text-navy" id="preferences-title">Preferências do trajeto</span>
          <span className="text-xs font-normal text-slate">{selectedCount} {selectedCount === 1 ? 'selecionada' : 'selecionadas'}</span>
        </span>
        <ChevronDown className={`size-5 shrink-0 text-slate transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open ? <div className="space-y-4 border-t border-beige px-4 py-4" id="travel-preferences-panel">
        {preferenceGroups.map((group) => (
          <fieldset key={group.id}>
            <legend className="mb-2 text-sm font-semibold text-navy">{group.label}</legend>
            <div className="space-y-2">
              {group.items.map((item) => (
                <label key={item.id} className={`flex min-h-10 items-start gap-3 rounded-lg px-2 py-2 ${item.supported ? 'cursor-pointer hover:bg-cream' : 'cursor-not-allowed opacity-60'}`}>
                  <input
                    type="checkbox"
                    className="mt-0.5 size-4 rounded border-slate text-navy focus:ring-sage"
                    checked={preferences[item.id]}
                    onChange={() => onToggle(item.id)}
                    disabled={!item.supported}
                  />
                  <span className="min-w-0 flex-1 text-sm text-navy">
                    {item.label}
                    {!item.supported ? <span className="block text-xs text-slate">Indisponível nesta versão</span> : null}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div> : null}
    </section>
  )
}
