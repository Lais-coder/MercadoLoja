import { useState, type FormEvent } from 'react';
import Modal from '../ui/Modal';
import type { CreateStoreAccessData } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateStoreAccessData) => Promise<void>;
}

export default function StoreAccessFormModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({ name, email, password });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar acesso');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Criar acesso da loja">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <p className="text-muted text-sm">
          O lojista usará este email e senha para acessar o perfil da loja e alimentar o catálogo e a
          revista.
        </p>

        <div>
          <label htmlFor="access-name" className="block text-sm font-semibold text-text mb-2">
            Nome do responsável *
          </label>
          <input
            id="access-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
            placeholder="Ex: Dona Ana"
          />
        </div>

        <div>
          <label htmlFor="access-email" className="block text-sm font-semibold text-text mb-2">
            Email de acesso *
          </label>
          <input
            id="access-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
            placeholder="loja@email.com"
          />
        </div>

        <div>
          <label htmlFor="access-password" className="block text-sm font-semibold text-text mb-2">
            Senha inicial *
          </label>
          <input
            id="access-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input-field"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-navy flex-1 disabled:opacity-60">
            {loading ? 'Criando...' : 'Criar acesso'}
          </button>
          <button type="button" onClick={handleClose} className="btn-outline">
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
