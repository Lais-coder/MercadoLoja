import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Gift, MessageCircle, Copy, Check } from 'lucide-react';
import type { BoxChallenge, Store } from '../types';
import { getCategoryLabel, getStoreRevistaPath, getWhatsAppLink } from '../services/api';
import { categoryConfig } from '../lib/categories';

interface Props {
  challenge: BoxChallenge;
  store: Pick<Store, 'id' | 'name' | 'slug' | 'boxNumber' | 'avatarLetter' | 'category' | 'whatsapp'>;
  showStoreLink?: boolean;
}

export default function BoxChallengeCard({ challenge, store, showStoreLink = true }: Props) {
  const [copied, setCopied] = useState(false);

  const badgeClass = categoryConfig[store.category]?.badgeClass ?? 'badge-moda';

  async function copyCoupon() {
    const text = `Cupom ${challenge.couponCode} — ${challenge.discountPercent}% off no Box ${store.boxNumber}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article className="relative bg-white text-text rounded-2xl overflow-hidden shadow-xl hover:-translate-y-1 transition-transform duration-300">
      <div className="bg-gradient-to-r from-yellow-cta to-amber-400 px-5 py-3 flex items-center justify-between">
        <span className="text-navy font-black text-sm uppercase tracking-wider flex items-center gap-2">
          <Gift className="w-4 h-4" />
          Missão
        </span>
        <span className="bg-navy text-white font-black text-lg px-3 py-1 rounded-lg">
          -{challenge.discountPercent}%
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-20 h-20 rounded-2xl bg-navy flex flex-col items-center justify-center shrink-0 shadow-lg">
            <span className="text-[10px] text-white/70 uppercase tracking-widest">Box</span>
            <span className="text-3xl font-black text-yellow-cta leading-none">{store.boxNumber}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-navy text-lg leading-snug mb-1">{challenge.title}</h3>
            <p className="text-sm text-text-muted truncate">{store.name}</p>
            <span className={`${badgeClass} mt-2 inline-flex`}>{getCategoryLabel(store.category)}</span>
          </div>
        </div>

        {challenge.description && (
          <p className="text-sm text-muted mb-5 leading-relaxed">{challenge.description}</p>
        )}

        <div className="bg-surface-muted/80 rounded-xl p-4 mb-5 space-y-2">
          <p className="text-xs font-bold text-navy uppercase tracking-wide">Como participar</p>
          <ol className="text-xs text-muted space-y-1.5 list-decimal list-inside">
            <li>
              Vá até o <strong className="text-text">Box {store.boxNumber}</strong> no mercado
            </li>
            <li>Mostre o cupom ao lojista</li>
            <li>
              Ganhe <strong className="text-navy">{challenge.discountPercent}% de desconto</strong>
            </li>
          </ol>
        </div>

        <div className="flex items-center justify-between gap-2 p-3 bg-navy/5 border border-dashed border-navy/20 rounded-lg mb-4">
          <div>
            <p className="text-[10px] text-muted uppercase tracking-wide">Cupom</p>
            <p className="font-mono font-bold text-navy text-lg">{challenge.couponCode}</p>
          </div>
          <button type="button" onClick={copyCoupon} className="btn-outline text-xs py-2 px-3 shrink-0">
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {showStoreLink && store.slug && (
            <Link
              to={getStoreRevistaPath(store.slug)}
              className="btn-outline w-full justify-center text-sm py-2.5"
            >
              <MapPin className="w-4 h-4" />
              Ver revista da loja
            </Link>
          )}
          {store.whatsapp && (
            <a
              href={getWhatsAppLink(
                store.whatsapp,
                `Olá! Quero resgatar o desafio "${challenge.title}" no Box ${store.boxNumber}. Meu cupom é ${challenge.couponCode} (${challenge.discountPercent}% off).`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm py-2.5"
            >
              <MessageCircle className="w-4 h-4" />
              Resgatar no WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
