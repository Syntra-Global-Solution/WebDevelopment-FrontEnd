export function FormField({ id, label, hint, error, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-sm font-semibold text-navy" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs leading-relaxed text-slate">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-wine" id={`${id}-error`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export const inputClass =
  'min-h-11 w-full rounded-lg border border-slate/35 bg-white px-3 py-2.5 text-base text-navy placeholder:text-slate/65 focus:border-navy focus:outline-none focus:ring-2 focus:ring-sage/45 disabled:bg-beige/25'
