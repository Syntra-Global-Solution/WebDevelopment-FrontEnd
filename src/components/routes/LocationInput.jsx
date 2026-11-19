import { LocateFixed, MapPin } from 'lucide-react'
import { FormField, inputClass } from '../ui/FormField'

export function LocationInput({ id, label, value, onChange, placeholder, onUseCurrent, locating, error }) {
  return (
    <FormField id={id} label={label} error={error}>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-3.5 size-4 text-slate" aria-hidden="true" />
        <input
          id={id}
          type="text"
          className={`${inputClass} pl-9 ${onUseCurrent ? 'pr-12' : ''}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="street-address"
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={Boolean(error)}
        />
        {onUseCurrent ? (
          <button
            type="button"
            className="absolute right-1 top-1 grid size-9 place-items-center rounded-lg text-slate hover:bg-beige/40 hover:text-navy focus-visible:outline-2 focus-visible:outline-sage"
            onClick={onUseCurrent}
            aria-label="Usar localização atual"
            title="Usar localização atual"
            disabled={locating}
          >
            <LocateFixed className={`size-5 ${locating ? 'animate-pulse motion-reduce:animate-none' : ''}`} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </FormField>
  )
}
