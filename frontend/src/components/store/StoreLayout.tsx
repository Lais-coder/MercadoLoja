import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Store, LogOut, Home, Package, Megaphone, Trophy, Rocket, Menu, X } from 'lucide-react';

const navItems = [
  { to: '/loja', label: 'Minha Loja', icon: Store, end: true },
  { to: '/loja/catalogo', label: 'Catálogo', icon: Package },
  { to: '/loja/impulsionar', label: 'Impulsionar', icon: Rocket },
  { to: '/loja/chamativos', label: 'Chamativos', icon: Megaphone },
  { to: '/loja/desafios', label: 'Desafios', icon: Trophy },
];

export default function StoreLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col lg:flex-row">
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-navy text-white flex flex-col shrink-0 transform transition-transform duration-300 lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-3">
          <div>
            <Link to="/loja" className="flex items-center gap-2.5 font-bold text-lg">
              <Store className="w-6 h-6" />
              Minha Loja
            </Link>
            <p className="text-white/60 text-xs mt-1">Gerencie catálogo e revista</p>
          </div>
          <button
            type="button"
            className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5 shrink-0" />
            Ver revista
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-border/60 px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            className="btn-icon"
            aria-label="Abrir menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-navy truncate">Minha Loja</span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
