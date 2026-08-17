import { useState } from 'react';
import { Plus, Megaphone, Sparkles } from 'lucide-react';
import { useMyStore } from '../../hooks/useMyStore';
import { api } from '../../services/api';
import PromotionFormModal from '../../components/admin/PromotionFormModal';

export default function StorePromotionsPage() {
  const { store, loading, error, reload } = useMyStore();
  const [modalOpen, setModalOpen] = useState(false);

  if (loading) return <p className="text-muted">Carregando...</p>;

  if (error || !store) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">{error || 'Loja não encontrada'}</p>
      </div>
    );
  }

  const promotions = store.promotions ?? [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-section flex items-center gap-2">
            <Megaphone className="w-7 h-7" />
            Chamativos
          </h1>
          <p className="text-muted mt-1">
            Promoções exibidas na seção &quot;Chamativos do Dia&quot; da revista.
          </p>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-navy">
          <Plus className="w-5 h-5" />
          Novo chamativo
        </button>
      </div>

      {promotions.length === 0 ? (
        <div className="card p-12 text-center">
          <Sparkles className="w-12 h-12 text-text-light mx-auto mb-4" />
          <p className="text-text font-semibold mb-2">Nenhum chamativo cadastrado</p>
          <p className="text-muted text-sm mb-6">
            Crie promoções para chamar a atenção dos clientes na revista.
          </p>
          <button type="button" onClick={() => setModalOpen(true)} className="btn-navy">
            <Plus className="w-5 h-5" />
            Novo chamativo
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {promotions.map((promo) => (
            <li key={promo.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-text">{promo.title}</p>
                  {promo.description && (
                    <p className="text-muted text-sm mt-1.5">{promo.description}</p>
                  )}
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full shrink-0 ${
                    promo.active
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {promo.active ? 'Ativo na revista' : 'Inativo'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <PromotionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async (data) => {
          await api.createPromotion(store.id, data);
          reload();
        }}
      />
    </div>
  );
}
