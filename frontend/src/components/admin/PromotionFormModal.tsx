import { useState, type FormEvent } from 'react';
import Modal from '../ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description?: string }) => Promise<void>;
}

export default function PromotionFormModal({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleClose() {
    setTitle('');
    setDescription('');
    setError('');
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ title, description: description || undefined });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar chamativo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Novo Chamativo da Semana">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="promo-title" className="block text-sm font-semibold text-text mb-2">
            Título da promoção *
          </label>
          <input
            id="promo-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
            placeholder="Ex: Promoção de Verão — 20% off"
          />
        </div>

        <div>
          <label htmlFor="promo-desc" className="block text-sm font-semibold text-text mb-2">
            Descrição
          </label>
          <textarea
            id="promo-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="Detalhes da promoção (opcional)"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-navy flex-1 disabled:opacity-60">
            {loading ? 'Salvando...' : 'Cadastrar chamativo'}
          </button>
          <button type="button" onClick={handleClose} className="btn-outline">
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
