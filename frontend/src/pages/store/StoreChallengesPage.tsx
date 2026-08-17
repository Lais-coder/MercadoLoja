import { useState, type FormEvent } from 'react';
import { Plus, Trophy } from 'lucide-react';
import { useMyStore } from '../../hooks/useMyStore';
import { api } from '../../services/api';

export default function StoreChallengesPage() {
  const { store, loading, error, reload } = useMyStore();
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercent, setDiscountPercent] = useState('5');
  const [couponCode, setCouponCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  if (loading) return <p className="text-muted">Carregando...</p>;
  if (error || !store) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">{error || 'Loja não encontrada'}</p>
      </div>
    );
  }

  const currentStore = store;
  const challenges = currentStore.challenges ?? [];

  function openForm() {
    setTitle(`Vá ao Box ${currentStore.boxNumber}`);
    setCouponCode(`BOX${currentStore.boxNumber}`);
    setFormOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError('');
    const discount = parseFloat(discountPercent);
    if (!title || !couponCode || isNaN(discount)) {
      setFormError('Preencha todos os campos');
      return;
    }

    setSaving(true);
    try {
      await api.createStoreChallenge(currentStore.id, {
        title,
        description: description || undefined,
        discountPercent: discount,
        couponCode,
      });
      setFormOpen(false);
      setDescription('');
      reload();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar desafio');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-section flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-cta" />
            Desafios do Box
          </h1>
          <p className="text-muted mt-1">
            Crie missões para atrair clientes ao Box {currentStore.boxNumber}.
          </p>
        </div>
        <button type="button" onClick={openForm} className="btn-navy">
          <Plus className="w-5 h-5" />
          Novo desafio
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 space-y-4">
          {formError && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{formError}</div>
          )}
          <div>
            <label className="block text-sm font-semibold mb-2">Título *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Desconto (%) *</label>
              <input
                type="number"
                min={1}
                max={100}
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Cupom *</label>
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="input-field font-mono"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-navy disabled:opacity-60">
              {saving ? 'Salvando...' : 'Publicar desafio'}
            </button>
            <button type="button" onClick={() => setFormOpen(false)} className="btn-outline">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {challenges.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-muted">Nenhum desafio ativo. Crie um para aparecer na revista principal!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {challenges.map((c) => (
            <li key={c.id} className="card p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-navy">{c.title}</p>
                <p className="text-sm text-muted">{c.description}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-navy">{c.discountPercent}% off</p>
                <p className="font-mono text-sm text-muted">{c.couponCode}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
