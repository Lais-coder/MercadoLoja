import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { api, formatPrice, getCategoryLabel, resolveMediaUrl } from '../../services/api';
import type { AdminProduct } from '../../types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .getAllProducts()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar produtos'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.store.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = filtered.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = filtered.length > 0 ? totalValue / filtered.length : 0;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="heading-section">Produtos</h1>
          <p className="text-muted mt-1">{products.length} produto(s) em todas as lojas</p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto ou loja..."
          className="input-field max-w-xs"
        />
      </div>

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-4 text-center">
            <p className="text-xs text-muted mb-1">Produtos listados</p>
            <p className="text-xl font-bold text-navy">{filtered.length}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xs text-muted mb-1">Preço médio</p>
            <p className="text-xl font-bold text-navy">{formatPrice(avgPrice)}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xs text-muted mb-1">Soma dos preços</p>
            <p className="text-xl font-bold text-navy">{formatPrice(totalValue)}</p>
          </div>
        </div>
      )}

      {loading && <p className="text-muted">Carregando...</p>}

      {error && <div className="card p-6 text-center text-red-600">{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Package className="w-12 h-12 text-text-light mx-auto mb-4" />
          <p className="text-text font-semibold">Nenhum produto encontrado</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-muted border-b border-border/60">
                  <th className="text-left py-3 px-5 font-semibold text-text-muted">Produto</th>
                  <th className="text-left py-3 px-5 font-semibold text-text-muted">Loja</th>
                  <th className="text-left py-3 px-5 font-semibold text-text-muted">Tamanhos</th>
                  <th className="text-left py-3 px-5 font-semibold text-text-muted hidden md:table-cell">
                    Categoria
                  </th>
                  <th className="text-right py-3 px-5 font-semibold text-text-muted">Preço</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveMediaUrl(product.imageUrl)}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover shrink-0"
                        />
                        <span className="font-medium text-text">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <Link
                        to={`/admin/lojas/${product.store.id}`}
                        className="text-navy font-medium hover:underline"
                      >
                        {product.store.name}
                      </Link>
                      <p className="text-xs text-muted">Box {product.store.boxNumber}</p>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.map((s) => (
                          <span
                            key={s}
                            className="text-xs font-semibold text-navy bg-navy/8 px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-5 hidden md:table-cell">
                      <span className="text-xs font-semibold text-navy bg-navy/8 px-2.5 py-1 rounded-full">
                        {getCategoryLabel(product.store.category)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right font-bold text-navy">
                      {product.price > 0 ? formatPrice(product.price) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
