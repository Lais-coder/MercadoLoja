import { Link } from 'react-router-dom';
import { BookOpen, Package } from 'lucide-react';
import { getCategoryLabel, getStoreRevistaPath } from '../services/api';
import { categoryConfig } from '../lib/categories';
import type { Store } from '../types';

interface Props {
  store: Store;
}

export default function StoreRevistaCard({ store }: Props) {
  const productCount = store._count?.products ?? store.products?.length ?? 0;
  const badgeClass = categoryConfig[store.category]?.badgeClass ?? 'badge-moda';

  return (
    <Link
      to={getStoreRevistaPath(store.slug)}
      className="card-interactive group block p-5 sm:p-6 h-full"
    >
      <div className="flex items-start gap-4">
        <div className="avatar-store w-14 h-14 text-lg shrink-0">{store.avatarLetter}</div>
        <div className="flex-1 min-w-0">
          <span className={`${badgeClass} text-[10px]`}>{getCategoryLabel(store.category)}</span>
          <h3 className="font-bold text-text mt-2 group-hover:text-navy transition-colors truncate">
            {store.name}
          </h3>
          <p className="text-muted text-sm mt-1">Box {store.boxNumber}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/60">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted">
          <Package className="w-3.5 h-3.5" />
          {productCount} {productCount === 1 ? 'produto' : 'produtos'}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy">
          <BookOpen className="w-3.5 h-3.5" />
          Abrir revista
        </span>
      </div>
    </Link>
  );
}
