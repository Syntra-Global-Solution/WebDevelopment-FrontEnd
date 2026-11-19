import { Button } from './Button'
import { Modal } from './Modal'

export function ConfirmDialog({ open, onClose, onConfirm, loading, title, children }) {
  return (
    <Modal open={open} onClose={onClose} title={title} description="Esta ação não pode ser desfeita.">
      <p className="text-sm leading-relaxed text-slate">{children}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancelar</Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Excluindo…' : 'Excluir'}
        </Button>
      </div>
    </Modal>
  )
}
