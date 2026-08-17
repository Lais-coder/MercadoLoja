import { Link } from 'react-router-dom';
import { Shirt, Sparkles, Utensils } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';

const categories = [
  { id: 'moda', label: 'MODA', icon: Shirt, to: '/moda' },
  { id: 'beleza', label: 'BELEZA', icon: Sparkles, to: '/beleza' },
  { id: 'alimentacao', label: 'ALIMENTAÇÃO', icon: Utensils, to: '/alimentacao' },
];

export default function CategoryGrid() {
  return (
    <section className="section-muted">
      <div className="container-main">
        <SectionHeader
          title="Explore por Categoria"
          subtitle="Encontre o que precisa navegando pelas seções do mercado."
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map(({ id, label, icon: Icon, to }) => (
            <Link key={id} id={id} to={to} className="card-category group">
              <div className="icon-circle">
                <Icon />
              </div>
              <span className="text-navy font-bold tracking-[0.15em] text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
