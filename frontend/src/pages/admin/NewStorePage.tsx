import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import type { CategoryType } from '../../types';

const categories: { value: CategoryType; label: string }[] = [
  { value: 'MODA', label: 'Moda' },
  { value: 'BELEZA', label: 'Beleza' },
  { value: 'ALIMENTACAO', label: 'Alimentação' },
];

export default function NewStorePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [boxNumber, setBoxNumber] = useState('');
  const [category, setCategory] = useState<CategoryType>('MODA');
  const [avatarLetter, setAvatarLetter] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const store = await api.createStore({
        name,
        boxNumber,
        category,
        avatarLetter: avatarLetter || name.charAt(0),
        whatsapp: whatsapp || undefined,
      });
      navigate(`/admin/lojas/${store.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar loja');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <Link to="/admin/lojas" className="text-link mb-6 inline-flex">
        <ArrowLeft className="w-4 h-4" />
        Voltar para lojas
      </Link>

      <h1 className="heading-section mb-2">Nova Loja</h1>
      <p className="text-muted mb-8">Cadastre uma nova loja no sistema.</p>

      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-text mb-2">
            Nome da loja *
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
            placeholder="Ex: Loja da Dona Ana"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="boxNumber" className="block text-sm font-semibold text-text mb-2">
              Número do Box *
            </label>
            <input
              id="boxNumber"
              value={boxNumber}
              onChange={(e) => setBoxNumber(e.target.value)}
              required
              className="input-field"
              placeholder="Ex: 08"
            />
          </div>
          <div>
            <label htmlFor="avatarLetter" className="block text-sm font-semibold text-text mb-2">
              Letra do avatar
            </label>
            <input
              id="avatarLetter"
              value={avatarLetter}
              onChange={(e) => setAvatarLetter(e.target.value.slice(0, 1))}
              maxLength={1}
              className="input-field"
              placeholder="A"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-text mb-2">
            Categoria *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="input-field"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="whatsapp" className="block text-sm font-semibold text-text mb-2">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="input-field"
            placeholder="5585999990000"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-navy disabled:opacity-60">
            {loading ? 'Salvando...' : 'Cadastrar loja'}
          </button>
          <Link to="/admin/lojas" className="btn-outline">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
