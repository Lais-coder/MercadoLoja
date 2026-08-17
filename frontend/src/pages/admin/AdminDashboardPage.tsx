import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Users,
  Package,
  Megaphone,
  TrendingUp,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { api, formatPrice, resolveMediaUrl } from '../../services/api';
import type { DashboardData } from '../../types';

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  to,
}: {
  icon: typeof Store;
  label: string;
  value: number | string;
  color: string;
  to?: string;
}) {
  const content = (
    <div className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-navy">{value}</p>
        <p className="text-muted text-sm">{label}</p>
      </div>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted">Carregando dashboard...</p>;

  if (error || !data) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">{error || 'Erro ao carregar dados'}</p>
      </div>
    );
  }

  const { priceStats } = data;

  return (
    <div>
      <div className="mb-8">
        <h1 className="heading-section">Visão Geral</h1>
        <p className="text-muted mt-1">Dashboard de controle do mercado</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard
          icon={Store}
          label="Lojas cadastradas"
          value={data.storesCount}
          color="bg-blue-50 text-blue-600"
          to="/admin/lojas"
        />
        <StatCard
          icon={Users}
          label="Funcionários"
          value={data.employeesCount}
          color="bg-emerald-50 text-emerald-600"
          to="/admin/funcionarios"
        />
        <StatCard
          icon={Package}
          label="Produtos"
          value={data.productsCount}
          color="bg-violet-50 text-violet-600"
          to="/admin/produtos"
        />
        <StatCard
          icon={Megaphone}
          label="Chamativos ativos"
          value={data.promotionsCount}
          color="bg-amber-50 text-amber-600"
          to="/admin/chamativos"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-navy" />
            <span className="text-sm font-semibold text-text-muted">Preço médio</span>
          </div>
          <p className="text-2xl font-bold text-navy">{formatPrice(priceStats.average)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-semibold text-text-muted">Menor preço</span>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{formatPrice(priceStats.min)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-semibold text-text-muted">Maior preço</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">{formatPrice(priceStats.max)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section>
          <h2 className="text-lg font-bold text-navy mb-4">Tabela de Preços</h2>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface-muted">
                  <tr className="border-b border-border/60">
                    <th className="text-left py-3 px-4 font-semibold text-text-muted">Produto</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-muted">Loja</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-muted">Preço</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.allProducts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-muted">
                        Nenhum produto com preço cadastrado
                      </td>
                    </tr>
                  ) : (
                    data.allProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-surface-muted/50">
                        <td className="py-3 px-4 font-medium text-text">{product.name}</td>
                        <td className="py-3 px-4 text-muted text-xs">
                          {product.store.name} · Box {product.store.boxNumber}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-navy">
                          {formatPrice(product.price)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-navy mb-4">Produtos Recentes</h2>
          <div className="card divide-y divide-border/60">
            {data.recentProducts.length === 0 ? (
              <p className="p-6 text-muted text-sm text-center">Nenhum produto cadastrado ainda.</p>
            ) : (
              data.recentProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4">
                  <img
                    src={resolveMediaUrl(product.imageUrl)}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text truncate">{product.name}</p>
                    <p className="text-xs text-muted">
                      {product.store.name} · Box {product.store.boxNumber}
                    </p>
                  </div>
                  <p className="font-bold text-navy shrink-0">{formatPrice(product.price)}</p>
                </div>
              ))
            )}
          </div>
          <Link to="/admin/produtos" className="text-link mt-4 inline-flex">
            Ver todos os produtos →
          </Link>
        </section>
      </div>
    </div>
  );
}
