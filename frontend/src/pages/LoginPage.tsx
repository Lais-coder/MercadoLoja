import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { token, user } = await api.login(email, password);
      localStorage.setItem('token', token);
      navigate(user.role === 'STORE' ? '/loja' : '/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="logo text-xl justify-center">
              <Store className="w-7 h-7" />
              Revista MercadoFácil
            </Link>
            <p className="text-muted mt-3">Área do administrador e lojistas</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-6">
            <h1 className="heading-section text-xl">Entrar</h1>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 border border-red-100 input-field">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
                placeholder="admin@mercadofacil.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-text mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-navy w-full disabled:opacity-60">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center mt-6">
            <Link to="/" className="text-link">
              ← Voltar para a revista
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
