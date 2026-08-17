import { Link } from 'react-router-dom';
import { Megaphone, MessageCircle } from 'lucide-react';
import type { StorePromotion } from '../types';
import { categoryConfig } from '../lib/categories';
import { getStoreRevistaPath, getWhatsAppLink } from '../services/api';
import SectionHeader from './ui/SectionHeader';

interface Props {
  promotions: StorePromotion[];
}

export default function DailyPromotions({ promotions }: Props) {
  if (promotions.length === 0) return null;

  return (
    <section id="chamativos" className="section bg-surface-muted/40">
      <div className="container-main">
        <SectionHeader
          title="Chamativos do Dia"
          subtitle="Promoções e ofertas especiais dos lojistas — atualizadas diariamente."
          icon={<Megaphone className="w-7 h-7 text-yellow-cta" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promo) => {
            const store = promo.store;
            const badgeClass =
              store?.category && categoryConfig[store.category]
                ? categoryConfig[store.category].badgeClass
                : 'badge-moda';

            return (
              <article
                key={promo.id}
                className="bg-white border border-amber-100 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  {store && (
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="avatar-store shrink-0">{store.avatarLetter}</div>
                      <div className="min-w-0">
                        {store.slug ? (
                          <Link
                            to={getStoreRevistaPath(store.slug)}
                            className="font-semibold text-text text-sm truncate block hover:text-navy transition-colors"
                          >
                            {store.name}
                          </Link>
                        ) : (
                          <p className="font-semibold text-text text-sm truncate">{store.name}</p>
                        )}
                        <p className="text-xs text-text-muted">Box {store.boxNumber}</p>
                      </div>
                    </div>
                  )}
                  {store?.category && (
                    <span className={`${badgeClass} shrink-0`}>
                      {categoryConfig[store.category]?.label ?? store.category}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-text text-lg leading-snug mb-2">{promo.title}</h3>

                {promo.description && (
                  <p className="text-muted text-sm leading-relaxed mb-5">{promo.description}</p>
                )}

                {store?.whatsapp && (
                  <a
                    href={getWhatsAppLink(
                      store.whatsapp,
                      `Olá! Vi o chamativo "${promo.title}" na Revista MercadoFácil e quero saber mais.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp w-full justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chamar no WhatsApp
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
