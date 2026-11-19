import { LoaderCircle } from 'lucide-react'

export function LoadingState({ label = 'Carregando' }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center gap-3 text-center text-sm text-slate" role="status">
      <LoaderCircle className="size-6 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
