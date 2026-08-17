import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StoreRevistaCard from '../components/StoreRevistaCard';
import SectionHeader from '../components/ui/SectionHeader';
import { api } from '../services/api';
import type { Store } from '../types';

export default function RevistasOnlinePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getStores()
      .then(setStores)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar revistas'))
      .finally(() => setLoading(false));
  }, []);

  const storesWithProducts = stores.filter(
    (store) => (store._count?.products ?? store.products?.length ?? 0) > 0
  );
  const emptyStores = stores.filter(
    (store) => (store._count?.products ?? store.products?.length ?? 0) === 0
  );

  return (
    <>
      <Header />
      <main className="section">
        <div className="container-main">
          <SectionHeader
            title="Revistas online"
            subtitle="Escolha uma loja e veja o catálogo completo com produtos, chamativos e desafios."
            icon={<BookOpen className="w-7 h-7 text-navy" />}
          />

          {loading && <p className="text-muted">Carregando revistas...</p>}

          {error && (
            <div className="card p-6 text-center text-red-600">{error}</div>
          )}

          {!loading && !error && stores.length === 0 && (
            <div className="text-center py-16 px-6 bg-surface-muted/50 rounded-xl border border-border/60">
              <BookOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="font-semibold text-text mb-2">Nenhuma revista disponível ainda</p>
              <p className="text-muted text-sm">As lojas estão preparando seus catálogos.</p>
            </div>
          )}

          {!loading && storesWithProducts.length > 0 && (
            <>
              <p className="text-muted text-sm mb-6">
                {storesWithProducts.length}{' '}
                {storesWithProducts.length === 1 ? 'loja com catálogo' : 'lojas com catálogo'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {storesWithProducts.map((store) => (
                  <StoreRevistaCard key={store.id} store={store} />
                ))}
              </div>
            </>
          )}

          {!loading && emptyStores.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold text-navy mb-4">Em breve</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 opacity-75">
                {emptyStores.map((store) => (
                  <StoreRevistaCard key={store.id} store={store} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
