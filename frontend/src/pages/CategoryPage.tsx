import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shirt, Sparkles, Utensils, PackageOpen } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/ui/SectionHeader';
import { api } from '../services/api';
import { categoryConfig, getCategoryFromSlug } from '../lib/categories';
import type { CategoryType, Product } from '../types';

const categoryIcons: Record<CategoryType, typeof Shirt> = {
  MODA: Shirt,
  BELEZA: Sparkles,
  ALIMENTACAO: Utensils,
};

export default function CategoryPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const category = getCategoryFromSlug(slug);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    api
      .getProductsByCategory(category)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category]);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const config = categoryConfig[category];
  const Icon = categoryIcons[category];

  return (
    <>
      <Header />
      <main>
        <section className="section">
          <div className="container-main">
            <SectionHeader
              title={config.label}
              subtitle={`Todos os produtos de ${config.label.toLowerCase()} cadastrados pelas lojas do mercado.`}
              icon={<Icon className="w-7 h-7 text-navy" />}
            />

            {loading ? (
              <div className="grid-products">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="card-product animate-pulse">
                    <div className="aspect-[5/4] bg-surface-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-surface-muted rounded w-2/3" />
                      <div className="h-4 bg-surface-muted rounded w-1/2" />
                      <div className="h-8 bg-surface-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 px-6 bg-surface-muted/50 rounded-xl border border-border/60">
                <PackageOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="font-semibold text-text mb-2">Nenhum produto cadastrado ainda</p>
                <p className="text-muted text-sm max-w-md mx-auto">
                  As lojas de {config.label.toLowerCase()} ainda não publicaram produtos na revista.
                  Volte em breve!
                </p>
              </div>
            ) : (
              <>
                <p className="text-muted text-sm mb-8">
                  {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </p>
                <div className="grid-products">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
