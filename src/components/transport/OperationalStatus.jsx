import { AlertCircle, CheckCircle2, CircleHelp, PauseCircle } from 'lucide-react'

const statusConfig = {
  normal: { Icon: CheckCircle2, className: 'bg-sage/20 text-navy' },
  slow: { Icon: AlertCircle, className: 'bg-rose/25 text-wine' },
  partial: { Icon: PauseCircle, className: 'bg-rose/25 text-wine' },
  interrupted: { Icon: AlertCircle, className: 'bg-wine text-white' },
  unknown: { Icon: CircleHelp, className: 'bg-beige/50 text-slate' },
}

export function OperationalStatus({ status, kind = 'unknown' }) {
  const { Icon, className } = statusConfig[kind] || statusConfig.unknown
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${className}`}>
      <Icon className="size-3.5" aria-hidden="true" /> {status}
    </span>
  )
}
