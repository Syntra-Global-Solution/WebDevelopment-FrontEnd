import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'

const styles = {
  info: { icon: Info, className: 'border-slate/25 bg-slate/8 text-navy' },
  success: { icon: CheckCircle2, className: 'border-sage/45 bg-sage/15 text-navy' },
  warning: { icon: TriangleAlert, className: 'border-rose/55 bg-rose/15 text-navy' },
  error: { icon: AlertCircle, className: 'border-wine/30 bg-wine/8 text-wine' },
}

export function StatusMessage({ tone = 'info', children, className = '', role }) {
  const style = styles[tone]
  const Icon = style.icon
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm leading-relaxed ${style.className} ${className}`}
      role={role || (tone === 'error' ? 'alert' : 'status')}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}
