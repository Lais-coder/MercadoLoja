import type { Product } from '../types';
import ProductCard from './ProductCard';
import SectionHeader from './ui/SectionHeader';

interface Props {
  products: Product[];
}

export default function VirtualShowcase({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="section">
      <div className="container-main">
        <SectionHeader
          title="Vitrine Virtual"
          subtitle="Uma seleção de produtos em destaque — fale direto com o lojista."
        />

        <div id="produtos" className="grid-products">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
