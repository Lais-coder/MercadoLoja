import Modal from './Modal';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: 'danger' | 'default';
}

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
  variant = 'default',
}: ConfirmModalProps) {
  async function handleConfirm() {
    await onConfirm();
  }

  return (
    <Modal open={open} onClose={loading ? () => {} : onClose} title={title}>
      <p className="text-muted text-sm leading-relaxed">{description}</p>

      <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="btn-outline sm:flex-none disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className={`flex-1 disabled:opacity-60 ${
            variant === 'danger'
              ? 'inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors'
              : 'btn-navy'
          }`}
        >
          {loading ? 'Aguarde...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
