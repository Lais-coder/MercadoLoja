import { useEffect, useState } from 'react';
import { Plus, Trophy, MapPin } from 'lucide-react';
import { api, getCategoryLabel } from '../../services/api';
import type { BoxChallenge, Store } from '../../types';
import ChallengeFormModal from '../../components/admin/ChallengeFormModal';

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState<BoxChallenge[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  function reload() {
    Promise.all([api.getAllChallenges(), api.getStores()])
      .then(([c, s]) => {
        setChallenges(c);
        setStores(s);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    reload();
  }, []);

  if (loading) return <p className="text-muted">Carregando...</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-section flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-cta" />
            Desafios do Mercado
          </h1>
          <p className="text-muted mt-1">
            Gamificação para incentivar clientes a visitarem os boxes físicos.
          </p>
        </div>
        <button type="button" onClick={() => setModalOpen(true)} className="btn-navy">
          <Plus className="w-5 h-5" />
          Novo desafio
        </button>
      </div>

      {challenges.length === 0 ? (
        <div className="card p-12 text-center">
          <Trophy className="w-12 h-12 text-text-light mx-auto mb-4" />
          <p className="font-semibold text-text mb-2">Nenhum desafio cadastrado</p>
          <p className="text-muted text-sm mb-6">
            Crie missões como &quot;Vá ao Box 08 e ganhe 5% de desconto&quot;.
          </p>
          <button type="button" onClick={() => setModalOpen(true)} className="btn-navy">
            <Plus className="w-5 h-5" />
            Criar primeiro desafio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {challenges.map((challenge) => (
            <article key={challenge.id} className="card p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-navy flex flex-col items-center justify-center shrink-0">
                  <span className="text-[9px] text-white/60 uppercase">Box</span>
                  <span className="text-xl font-black text-yellow-cta">
                    {challenge.store?.boxNumber ?? '?'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-navy">{challenge.title}</h3>
                  <p className="text-sm text-muted">{challenge.store?.name}</p>
                  <span
                    className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                      challenge.active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {challenge.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              {challenge.description && (
                <p className="text-sm text-muted mb-4">{challenge.description}</p>
              )}

              <div className="flex items-center justify-between text-sm border-t border-border/60 pt-4">
                <span className="font-bold text-navy">{challenge.discountPercent}% off</span>
                <span className="font-mono text-muted">{challenge.couponCode}</span>
              </div>

              {challenge.store && (
                <p className="text-xs text-muted mt-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {getCategoryLabel(challenge.store.category)}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <ChallengeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        stores={stores}
        onSubmit={async (data) => {
          await api.createChallenge(data);
          reload();
        }}
      />
    </div>
  );
}
