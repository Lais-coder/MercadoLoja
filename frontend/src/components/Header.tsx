import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Store, Search, Menu, X } from 'lucide-react';
import { api } from '../services/api';
import type { User } from '../types';

const navLinks = [
  { label: 'Moda', to: '/moda' },
  { label: 'Beleza', to: '/beleza' },
  { label: 'Alimentação', to: '/alimentacao' },
  { label: 'Sobre', to: '/#sobre' },
];

export default function Header() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }

    api
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const panelLink = user?.role === 'STORE' ? '/loja' : '/admin';
  const panelLabel = user?.role === 'STORE' ? 'Minha Loja' : 'Painel';

  return (
    <header className="header-main">
      <div className="container-main">
        <div className="flex items-center justify-between h-16 sm:h-[4.5rem] gap-3">
          <Link to="/" className="logo min-w-0">
            <Store className="logo-icon shrink-0" />
            <span className="truncate">
              <span className="hidden sm:inline">Revista </span>
              MercadoFácil
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => {
              const isActive =
                link.to.startsWith('/') &&
                !link.to.includes('#') &&
                location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link${isActive ? ' text-navy font-semibold' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button type="button" className="btn-icon hidden sm:inline-flex" aria-label="Buscar">
              <Search className="w-5 h-5" />
            </button>
            {user ? (
              <Link to={panelLink} className="btn-outline hidden sm:inline-flex">
                {panelLabel}
              </Link>
            ) : (
              <Link to="/login" className="btn-outline hidden sm:inline-flex">
                Entrar
              </Link>
            )}
            <button
              type="button"
              className="btn-icon md:hidden"
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/40 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      <nav
        className={`md:hidden fixed top-16 left-0 right-0 z-50 bg-white border-b border-border shadow-lg transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-[calc(100vh-4rem)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="container-main py-4 space-y-1">
          {navLinks.map((link) => {
            const isActive =
              link.to.startsWith('/') &&
              !link.to.includes('#') &&
              location.pathname === link.to;

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-navy/8 text-navy'
                    : 'text-text-muted hover:bg-surface-muted hover:text-navy'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="pt-3 mt-2 border-t border-border/60">
            {user ? (
              <Link to={panelLink} className="btn-navy w-full">
                {panelLabel}
              </Link>
            ) : (
              <Link to="/login" className="btn-navy w-full">
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
