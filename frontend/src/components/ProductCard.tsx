import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice, getStoreRevistaPath, getWhatsAppLink, resolveMediaUrl } from '../services/api';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <article className="card-product group">
      <div className="aspect-[5/4] overflow-hidden bg-surface-muted">
        <img
          src={resolveMediaUrl(product.imageUrl)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {product.store.avatarLetter}
          </div>
          {product.store.slug ? (
            <Link
              to={getStoreRevistaPath(product.store.slug)}
              className="text-[11px] sm:text-xs text-text-muted hover:text-navy truncate font-medium transition-colors"
            >
              {product.store.name} · Box {product.store.boxNumber}
            </Link>
          ) : (
            <span className="text-[11px] text-text-muted truncate font-medium">
              {product.store.name} · Box {product.store.boxNumber}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-text text-sm mb-1.5 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {product.sizes && product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.sizes.map((size) => (
              <span
                key={size}
                className="px-1.5 py-0.5 bg-surface-muted text-text-muted text-[10px] font-semibold rounded-full"
              >
                {size}
              </span>
            ))}
          </div>
        )}

        <p className="text-navy font-bold text-lg mb-3 tracking-tight">
          {formatPrice(product.price)}
        </p>

        <a
          href={
            product.store.whatsapp
              ? getWhatsAppLink(
                  product.store.whatsapp,
                  `Olá! Vi o produto "${product.name}" na Revista MercadoFácil e gostaria de saber mais.`
                )
              : '#'
          }
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp !py-2 !text-xs"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          WhatsApp
        </a>
      </div>
    </article>
  );
}
