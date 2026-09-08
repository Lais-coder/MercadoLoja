import { useState } from 'react';
import { Star } from 'lucide-react';
import type { Highlight } from '../types';
import { categoryConfig } from '../lib/categories';
import SectionHeader from './ui/SectionHeader';

const highlightFallbackImages: Partial<Record<Highlight['category'], string>> = {
  MODA: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=400&fit=crop',
  BELEZA: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop',
  ALIMENTACAO: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
};

interface Props {
  highlights: Highlight[];
}

function HighlightCard({ highlight }: { highlight: Highlight }) {
  const [imageSrc, setImageSrc] = useState(highlight.imageUrl);
  const badgeClass = categoryConfig[highlight.category]?.badgeClass ?? 'badge-moda';

  function handleImageError() {
    const fallback = highlightFallbackImages[highlight.category];
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
    }
  }

  return (
    <article className="card-highlight group">
      <img
        src={imageSrc}
        alt={highlight.title}
        onError={handleImageError}
        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
          highlight.category === 'MODA' ? 'object-center' : ''
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute top-5 left-5">
        <span className={badgeClass}>
          {categoryConfig[highlight.category]?.label ?? highlight.category}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-white font-semibold text-base leading-snug">{highlight.title}</p>
      </div>
    </article>
  );
}

export default function WeeklyHighlights({ highlights }: Props) {
  if (highlights.length === 0) return null;

  return (
    <section className="section">
      <div className="container-main">
        <SectionHeader
          title="Destaques da Semana"
          subtitle="As melhores ofertas selecionadas pelos lojistas do mercado."
          icon={<Star className="w-7 h-7 text-yellow-cta fill-yellow-cta" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {highlights.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))}
        </div>
      </div>
    </section>
  );
}
