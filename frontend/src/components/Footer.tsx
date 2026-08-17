import { Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'Termos de Uso', to: '/termos' },
  { label: 'Privacidade', to: '/privacidade' },
  { label: 'Contato', to: '#contato', external: true },
];

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="container-main">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="logo">
            <Store className="logo-icon" />
            <span>Revista MercadoFácil</span>
          </Link>

          <p className="text-text-light text-xs text-center max-w-md leading-relaxed">
            © 2024 Centro Público Comercial Geraldo Machado.
            <br className="hidden sm:block" />
            {' '}Feito por permissionários, para você.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3">
            {footerLinks.map(({ label, to, external }) =>
              external ? (
                <a key={label} href={to} className="text-text-light text-xs hover:text-navy transition-colors font-medium">
                  {label}
                </a>
              ) : (
                <Link key={label} to={to} className="text-text-light text-xs hover:text-navy transition-colors font-medium">
                  {label}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
