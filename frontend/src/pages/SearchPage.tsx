import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Store } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import StoreRevistaCard from '../components/StoreRevistaCard';
import { api } from '../services/api';
import { categoryConfig, getCategoryFromSlug } from '../lib/categories';
import type { Product, Store as StoreType } from '../types';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [term, setTerm] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setTerm(query);
  }, [query]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setProducts([]);
      setStores([]);
      setSearched(false);
      return;
    }

    const category = getCategoryFromSlug(trimmed.toLowerCase());
    if (category) {
      setLoading(true);
      api
        .getProductsByCategory(category)
        .then((items) => {
          setProducts(items);
          setStores([]);
          setSearched(true);
        })
        .catch(() => {
          setProducts([]);
          setStores([]);
          setSearched(true);
        })
        .finally(() => setLoading(false));
      return;
    }

    setLoading(true);
    api
      .search(trimmed)
      .then(({ products: foundProducts, stores: foundStores }) => {
        setProducts(foundProducts);
        setStores(foundStores);
        setSearched(true);
      })
      .catch(() => {
        setProducts([]);
        setStores([]);
        setSearched(true);
      })
      .finally(() => setLoading(false));
  }, [query]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = term.trim();
    if (!trimmed) {
      setSearchParams({});
      return;
    }
    setSearchParams({ q: trimmed });
  }

  const categoryMatch = getCategoryFromSlug(query.trim().toLowerCase());
  const hasResults = products.length > 0 || stores.length > 0;

  return (
    <>
      <Header />
      <main className="section">
        <div className="container-main">
          <h1 className="heading-section mb-2">Buscar na revista</h1>
          <p className="text-muted mb-8">
            Encontre produtos, lojas ou categorias como Moda, Beleza e Alimentação.
          </p>

          <form onSubmit={handleSubmit} className="max-w-2xl mb-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  type="search"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="Produto, loja, box ou categoria..."
                  className="input-field pl-12"
                />
              </div>
              <button type="submit" className="btn-navy shrink-0">
                Buscar
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mb-8">
            {Object.values(categoryConfig).map((cat) => (
              <Link
                key={cat.slug}
                to={`/busca?q=${encodeURIComponent(cat.slug)}`}
                className="px-3 py-1.5 rounded-full text-xs font-semibold border border-border hover:border-navy/30 hover:bg-navy/5 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <Link
              to="/revistas"
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-navy/20 bg-navy/5 text-navy hover:bg-navy/10 transition-colors"
            >
              Ver revistas online
            </Link>
          </div>

          {loading && <p className="text-muted">Buscando...</p>}

          {!loading && searched && !hasResults && (
            <div className="text-center py-16 px-6 bg-surface-muted/50 rounded-xl border border-border/60">
              <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <p className="font-semibold text-text mb-2">Nenhum resultado para &quot;{query}&quot;</p>
              <p className="text-muted text-sm mb-6">
                Tente outro termo ou explore as revistas das lojas.
              </p>
              <Link to="/revistas" className="btn-navy inline-flex">
                Ver revistas online
              </Link>
            </div>
          )}

          {!loading && stores.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <Store className="w-5 h-5" />
                Lojas encontradas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {stores.map((store) => (
                  <StoreRevistaCard key={store.id} store={store} />
                ))}
              </div>
            </section>
          )}

          {!loading && products.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-navy mb-4">
                {categoryMatch
                  ? `Produtos em ${categoryConfig[categoryMatch].label}`
                  : `Produtos encontrados (${products.length})`}
              </h2>
              <div className="grid-products">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {categoryMatch && products[0]?.store.slug && (
                <p className="text-muted text-sm mt-6">
                  Cada produto leva à revista da loja.{' '}
                  <Link to="/revistas" className="text-link">
                    Ver todas as revistas online
                  </Link>
                </p>
              )}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
