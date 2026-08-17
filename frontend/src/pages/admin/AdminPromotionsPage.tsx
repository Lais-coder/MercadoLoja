import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Sparkles } from 'lucide-react';
import { api, getCategoryLabel } from '../../services/api';
import type { StorePromotion } from '../../types';

type Filter = 'hoje' | 'ativos' | 'todos';

function isToday(dateStr?: string) {
  if (!dateStr) return false;
  const date = new Date(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<StorePromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('hoje');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .getAllPromotions()
      .then(setPromotions)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar chamativos'))
      .finally(() => setLoading(false));
  }, []);

  const todayCount = promotions.filter((p) => isToday(p.createdAt)).length;
  const activeCount = promotions.filter((p) => p.active).length;

  const filtered = promotions.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.store?.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'hoje') return isToday(p.createdAt);
    if (filter === 'ativos') return p.active;
    return true;
  });

  const filters: { key: Filter; label: string; count: number }[] = [
    { key: 'hoje', label: 'Chamativos de hoje', count: todayCount },
    { key: 'ativos', label: 'Ativos', count: activeCount },
    { key: 'todos', label: 'Todos', count: promotions.length },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="heading-section flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-amber-500" />
            Chamativos do Dia
          </h1>
          <p className="text-muted mt-1">
            Promoções e destaques cadastrados pelas lojas
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar chamativo ou loja..."
          className="input-field max-w-xs"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === key
                ? 'bg-navy text-white'
                : 'bg-white text-text-muted border border-border hover:border-navy/30'
            }`}
          >
            {label}
            <span className="ml-1.5 opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {loading && <p className="text-muted">Carregando...</p>}

      {error && <div className="card p-6 text-center text-red-600">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Sparkles className="w-12 h-12 text-text-light mx-auto mb-4" />
          <p className="text-text font-semibold mb-2">
            {filter === 'hoje'
              ? 'Nenhum chamativo cadastrado hoje'
              : 'Nenhum chamativo encontrado'}
          </p>
          <p className="text-muted text-sm">
            Cadastre chamativos na página de cada loja.
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((promo) => (
            <article
              key={promo.id}
              className="card p-5 border-l-4 border-l-amber-400 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  {promo.store && (
                    <div className="avatar-store w-9 h-9 text-sm shrink-0">
                      {promo.store.avatarLetter}
                    </div>
                  )}
                  <div className="min-w-0">
                    {promo.store ? (
                      <Link
                        to={`/admin/lojas/${promo.store.id}`}
                        className="text-sm font-semibold text-navy hover:underline truncate block"
                      >
                        {promo.store.name}
                      </Link>
                    ) : (
                      <span className="text-sm text-muted">Loja removida</span>
                    )}
                    <p className="text-xs text-muted">
                      Box {promo.store?.boxNumber ?? '—'}
                      {promo.store?.category && (
                        <> · {getCategoryLabel(promo.store.category)}</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      promo.active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {promo.active ? 'Ativo' : 'Inativo'}
                  </span>
                  {isToday(promo.createdAt) && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
                      Hoje
                    </span>
                  )}
                </div>
              </div>

              <h2 className="font-bold text-text mb-2 leading-snug">{promo.title}</h2>

              {promo.description && (
                <p className="text-muted text-sm mb-3 line-clamp-3">{promo.description}</p>
              )}

              <p className="text-xs text-text-light">{formatDate(promo.createdAt)}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
