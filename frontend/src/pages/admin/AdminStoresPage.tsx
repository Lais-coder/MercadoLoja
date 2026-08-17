import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Store, Package, Users } from 'lucide-react';
import { api } from '../../services/api';
import { getCategoryLabel } from '../../services/api';
import type { Store as StoreType } from '../../types';

export default function AdminStoresPage() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getStores()
      .then(setStores)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar lojas'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-section">Lojas Cadastradas</h1>
          <p className="text-muted mt-1">Gerencie as lojas e seus catálogos de produtos.</p>
        </div>
        <Link to="/admin/lojas/nova" className="btn-navy">
          <Plus className="w-5 h-5" />
          Adicionar loja
        </Link>
      </div>

      {loading && <p className="text-muted">Carregando lojas...</p>}

      {error && (
        <div className="card p-6 text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-muted text-sm">
            Verifique se o backend e o PostgreSQL estão rodando.
          </p>
        </div>
      )}

      {!loading && !error && stores.length === 0 && (
        <div className="card p-12 text-center">
          <Store className="w-12 h-12 text-text-light mx-auto mb-4" />
          <p className="text-text font-semibold mb-2">Nenhuma loja cadastrada</p>
          <p className="text-muted mb-6">Comece adicionando a primeira loja do mercado.</p>
          <Link to="/admin/lojas/nova" className="btn-navy">
            <Plus className="w-5 h-5" />
            Adicionar loja
          </Link>
        </div>
      )}

      {!loading && stores.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Link
              key={store.id}
              to={`/admin/lojas/${store.id}`}
              className="card-interactive p-6 group block"
            >
              <div className="flex items-start gap-4">
                <div className="avatar-store w-12 h-12 text-base">{store.avatarLetter}</div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-text group-hover:text-navy transition-colors truncate">
                    {store.name}
                  </h2>
                  <p className="text-muted text-sm">Box {store.boxNumber}</p>
                  <span className="inline-block mt-2 text-xs font-semibold text-navy bg-navy/8 px-2.5 py-1 rounded-full">
                    {getCategoryLabel(store.category)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-5 pt-5 border-t border-border/60 text-muted text-sm">
                <span className="flex items-center gap-1.5">
                  <Package className="w-4 h-4" />
                  {store._count?.products ?? 0} produto(s)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {store._count?.employees ?? 0} funcionário(s)
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
