import RevistaTutorialVideo from '../../components/store/RevistaTutorialVideo';
import { Link } from 'react-router-dom';
import { Megaphone, Star, Plus, Link2, ExternalLink, Trophy, Rocket } from 'lucide-react';
import { useState } from 'react';
import { useMyStore } from '../../hooks/useMyStore';
import { getCategoryLabel, getStoreRevistaPath, getStoreRevistaUrl } from '../../services/api';

export default function StoreOverviewPage() {
  const { store, loading, error } = useMyStore();
  const [copied, setCopied] = useState(false);

  async function copyRevistaLink() {
    if (!store?.slug) return;
    await navigator.clipboard.writeText(getStoreRevistaUrl(store.slug));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) return <p className="text-muted">Carregando...</p>;

  if (error || !store) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">{error || 'Loja não encontrada'}</p>
      </div>
    );
  }

  const productCount = store._count?.products ?? store.products?.length ?? 0;
  const promotionCount = store._count?.promotions ?? store.promotions?.length ?? 0;
  const featuredCount = store.products?.filter((p) => p.featured).length ?? 0;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="avatar-store w-14 h-14 text-lg">{store.avatarLetter}</div>
        <div>
          <h1 className="heading-section">{store.name}</h1>
          <p className="text-muted">
            Box {store.boxNumber} · {getCategoryLabel(store.category)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="card p-5">
          <p className="text-2xl font-bold text-navy">{productCount}</p>
          <p className="text-muted text-sm">Produtos no catálogo</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-bold text-navy">{featuredCount}</p>
          <p className="text-muted text-sm">Na vitrine da revista</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-bold text-navy">{promotionCount}</p>
          <p className="text-muted text-sm">Chamativos ativos</p>
        </div>
      </div>

      <section className="card p-6 mb-8 border-navy/15 bg-navy/3">
        <h2 className="text-lg font-bold text-navy mb-2 flex items-center gap-2">
          <Link2 className="w-5 h-5" />
          Sua revista online
        </h2>
        <p className="text-muted text-sm mb-4">
          Compartilhe este link com seus clientes para eles verem seus produtos e chamativos.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <code className="flex-1 px-4 py-3 bg-white border border-border/60 rounded-lg text-sm text-navy truncate">
            {getStoreRevistaUrl(store.slug)}
          </code>
          <button type="button" onClick={copyRevistaLink} className="btn-navy shrink-0">
            {copied ? 'Link copiado!' : 'Copiar link'}
          </button>
          <Link
            to={getStoreRevistaPath(store.slug)}
            target="_blank"
            className="btn-outline shrink-0"
          >
            <ExternalLink className="w-4 h-4" />
            Ver revista
          </Link>
        </div>
      </section>

      <section className="card p-6 mb-8">
        <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-cta" />
          Como alimentar a revista
        </h2>
        <p className="text-muted text-sm mb-5">
          Assista ao tutorial e siga os passos para manter sua revista sempre atualizada para os
          clientes.
        </p>

        <RevistaTutorialVideo />

        <ul className="space-y-2 text-sm text-muted">
          <li>
            <strong className="text-text">Revista da loja:</strong> seu link personalizado mostra
            todos os produtos e chamativos para clientes.
          </li>
          <li>
            <strong className="text-text">Catálogo:</strong> cadastre produtos com fotos, preços e
            tamanhos — eles aparecem na página da sua categoria e na sua revista.
          </li>
          <li>
            <strong className="text-text">Vitrine:</strong> marque produtos como destaque para
            aparecerem na página inicial (máx. 6).
          </li>
          <li>
            <strong className="text-text">Impulsionar:</strong> selecione produtos e simule
            campanhas pagas com vínculo ao Facebook para alcançar mais clientes.
          </li>
          <li>
            <strong className="text-text">Desafios:</strong> crie missões como &quot;Vá ao Box {store.boxNumber}&quot;
            com cupom de desconto para atrair clientes ao mercado.
          </li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link to="/loja/catalogo" className="btn-navy">
          <Plus className="w-5 h-5" />
          Gerenciar catálogo
        </Link>
        <Link to="/loja/impulsionar" className="btn-outline border-navy/30 bg-navy/5">
          <Rocket className="w-5 h-5" />
          Impulsionar produtos
        </Link>
        <Link to="/loja/chamativos" className="btn-outline">
          <Megaphone className="w-5 h-5" />
          Chamativos
        </Link>
        <Link to="/loja/desafios" className="btn-outline">
          <Trophy className="w-5 h-5" />
          Criar desafio
        </Link>
        <Link to={getStoreRevistaPath(store.slug)} target="_blank" className="btn-outline">
          <ExternalLink className="w-5 h-5" />
          Ver minha revista
        </Link>
      </div>
    </div>
  );
}
