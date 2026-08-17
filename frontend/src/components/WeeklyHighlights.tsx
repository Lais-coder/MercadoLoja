import { Star } from 'lucide-react';
import type { Highlight } from '../types';
import { categoryConfig } from '../lib/categories';
import SectionHeader from './ui/SectionHeader';

interface Props {
  highlights: Highlight[];
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
          {highlights.map((highlight) => {
            const badgeClass =
              categoryConfig[highlight.category]?.badgeClass ?? 'badge-moda';

            return (
              <article key={highlight.id} className="card-highlight group">
                <img
                  src={highlight.imageUrl}
                  alt={highlight.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute top-5 left-5">
                  <span className={badgeClass}>
                    {categoryConfig[highlight.category]?.label ?? highlight.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-semibold text-base leading-snug">
                    {highlight.title}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
