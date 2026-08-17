import { useState, type FormEvent } from 'react';
import Modal from '../ui/Modal';
import type { CreateChallengeData, Store } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  stores: Store[];
  onSubmit: (data: CreateChallengeData) => Promise<void>;
}

export default function ChallengeFormModal({ open, onClose, stores, onSubmit }: Props) {
  const [storeId, setStoreId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState('5');
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setStoreId('');
    setTitle('');
    setDescription('');
    setDiscountPercent('5');
    setCouponCode('');
    setError('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleStoreChange(id: string) {
    setStoreId(id);
    const store = stores.find((s) => s.id === id);
    if (store) {
      setTitle(`Vá ao Box ${store.boxNumber}`);
      if (!couponCode) setCouponCode(`BOX${store.boxNumber}`);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const discount = parseFloat(discountPercent.replace(',', '.'));
    if (!storeId || !title || !couponCode || isNaN(discount) || discount <= 0 || discount > 100) {
      setError('Preencha todos os campos corretamente');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        storeId,
        title,
        description: description || undefined,
        discountPercent: discount,
        couponCode: couponCode.toUpperCase(),
      });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar desafio');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Novo desafio do box">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="challenge-store" className="block text-sm font-semibold text-text mb-2">
            Loja / Box *
          </label>
          <select
            id="challenge-store"
            value={storeId}
            onChange={(e) => handleStoreChange(e.target.value)}
            required
            className="input-field"
          >
            <option value="">Selecione a loja</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                Box {store.boxNumber} — {store.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="challenge-title" className="block text-sm font-semibold text-text mb-2">
            Título do desafio *
          </label>
          <input
            id="challenge-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input-field"
            placeholder="Ex: Vá ao Box 08"
          />
        </div>

        <div>
          <label htmlFor="challenge-desc" className="block text-sm font-semibold text-text mb-2">
            Descrição
          </label>
          <textarea
            id="challenge-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="input-field resize-none"
            placeholder="Instruções para o cliente..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="challenge-discount" className="block text-sm font-semibold text-text mb-2">
              Desconto (%) *
            </label>
            <input
              id="challenge-discount"
              type="number"
              min={1}
              max={100}
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="challenge-coupon" className="block text-sm font-semibold text-text mb-2">
              Código do cupom *
            </label>
            <input
              id="challenge-coupon"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              required
              className="input-field font-mono"
              placeholder="BOX08"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-navy flex-1 disabled:opacity-60">
            {loading ? 'Salvando...' : 'Criar desafio'}
          </button>
          <button type="button" onClick={handleClose} className="btn-outline">
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
