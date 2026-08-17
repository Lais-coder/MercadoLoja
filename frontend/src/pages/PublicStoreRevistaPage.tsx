import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { MessageCircle, Megaphone, PackageOpen, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { StoreChallengeSection } from '../components/BoxChallengeBoard';
import { api, getCategoryLabel, getWhatsAppLink } from '../services/api';
import { categoryConfig } from '../lib/categories';
import type { BoxChallenge, CatalogItem, Product, Store, StorePromotion } from '../types';

function toProduct(item: CatalogItem, store: Store): Product {
  return {
    id: item.id,
    name: item.name,
    price: item.price,
    imageUrl: item.imageUrl,
    sizes: item.sizes,
    featured: item.featured,
    store: {
      id: store.id,
      name: store.name,
      slug: store.slug,
      boxNumber: store.boxNumber,
      avatarLetter: store.avatarLetter,
      whatsapp: store.whatsapp,
    },
  };
}

export default function PublicStoreRevistaPage() {
  const { slug } = useParams<{ slug: string }>();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setNotFound(false);
    api
      .getStoreRevista(slug)
      .then(setStore)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!slug) return <Navigate to="/" replace />;

  if (loading) {
    return (
      <>
        <Header />
        <main className="section">
          <div className="container-main">
            <p className="text-muted">Carregando revista...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !store) {
    return (
      <>
        <Header />
        <main className="section">
          <div className="container-main text-center py-16">
            <PackageOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h1 className="heading-section mb-2">Loja não encontrada</h1>
            <p className="text-muted mb-6">Esta revista não existe ou foi removida.</p>
            <Link to="/" className="btn-navy inline-flex">
              <ArrowLeft className="w-4 h-4" />
              Voltar para a revista
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const products = store.products ?? [];
  const promotions = store.promotions ?? [];
  const challenges = (store.challenges ?? []) as BoxChallenge[];
  const badgeClass = categoryConfig[store.category]?.badgeClass ?? 'badge-moda';

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-navy text-white">
          <div className="absolute inset-0 hero-overlay opacity-90" />
          <div className="container-main relative py-14 md:py-20">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Revista MercadoFácil
            </Link>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="avatar-store w-20 h-20 text-2xl shrink-0">{store.avatarLetter}</div>
              <div className="flex-1">
                <span className={badgeClass}>Revista · {getCategoryLabel(store.category)}</span>
                <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-2">{store.name}</h1>
                <p className="text-white/75 text-base">
                  Box {store.boxNumber} · Centro Público Comercial Geraldo Machado
                </p>
              </div>
              {store.whatsapp && (
                <a
                  href={getWhatsAppLink(
                    store.whatsapp,
                    `Olá! Vi a revista da ${store.name} no MercadoFácil e gostaria de saber mais.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp shrink-0 w-full md:!w-auto px-6"
                >
                  <MessageCircle className="w-4 h-4" />
                  Falar com a loja
                </a>
              )}
            </div>
          </div>
        </section>

        <StoreChallengeSection store={store} challenges={challenges} />

        {promotions.length > 0 && (
          <section className="section bg-surface-muted/40">
            <div className="container-main">
              <div className="flex items-center gap-3 mb-8">
                <Megaphone className="w-6 h-6 text-yellow-cta" />
                <h2 className="heading-section">Chamativos da loja</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(promotions as StorePromotion[]).map((promo) => (
                  <article
                    key={promo.id}
                    className="bg-white border border-amber-100 rounded-xl p-5 shadow-sm"
                  >
                    <h3 className="font-bold text-text mb-2">{promo.title}</h3>
                    {promo.description && (
                      <p className="text-muted text-sm leading-relaxed">{promo.description}</p>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section">
          <div className="container-main">
            <div className="mb-8">
              <h2 className="heading-section">Catálogo</h2>
              <p className="text-muted mt-2">
                {products.length === 0
                  ? 'Esta loja ainda não publicou produtos.'
                  : `${products.length} ${products.length === 1 ? 'produto disponível' : 'produtos disponíveis'} — fale direto pelo WhatsApp.`}
              </p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-16 px-6 bg-surface-muted/50 rounded-xl border border-border/60">
                <PackageOpen className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="font-semibold text-text mb-2">Catálogo em breve</p>
                <p className="text-muted text-sm">
                  {store.name} está preparando novidades para você.
                </p>
              </div>
            ) : (
              <div className="grid-products">
                {products.map((item) => (
                  <ProductCard key={item.id} product={toProduct(item, store)} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
