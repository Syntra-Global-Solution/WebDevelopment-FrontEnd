import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal({ open, onClose, title, description, children, size = 'md' }) {
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    panelRef.current?.focus()
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [onClose, open])

  if (!open) return null
  return (
    <div className="absolute inset-0 z-[1200] flex items-end bg-navy/55 p-3 sm:items-center" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section
        ref={panelRef}
        className={`max-h-[90%] w-full overflow-y-auto rounded-xl bg-cream p-5 shadow-xl outline-none ${size === 'lg' ? 'max-w-lg' : 'max-w-sm'} mx-auto`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-navy" id="modal-title">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate" id="modal-description">{description}</p> : null}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar">
            <X className="size-5" aria-hidden="true" />
          </Button>
        </div>
        {children}
      </section>
    </div>
  )
}
