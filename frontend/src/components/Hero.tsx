import { Search, ArrowRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    navigate(`/busca?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <section className="relative min-h-[420px] sm:min-h-[500px] lg:min-h-[560px] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1600&h=900&fit=crop)',
        }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 container-main py-16 sm:py-20 lg:py-24 w-full">
        <div className="max-w-2xl">
          <span className="badge-hero mb-5 inline-block">
            Revista Digital · Maracanaú
          </span>

          <h1 className="heading-hero mb-8 sm:mb-10">
            O Mercado de Maracanaú inteiro na palma da sua mão
          </h1>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Produto, loja, box ou categoria..."
                className="input-search"
                aria-label="Buscar produtos e lojas"
              />
            </div>
            <Link to="/revistas" className="btn-cta w-full sm:w-auto sm:whitespace-nowrap">
              Ver revistas online
              <ArrowRight className="w-5 h-5" />
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}
