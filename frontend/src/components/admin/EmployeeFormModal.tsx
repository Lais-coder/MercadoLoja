import { useState, type FormEvent } from 'react';
import Modal from '../ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; role?: string }) => Promise<void>;
}

export default function EmployeeFormModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleClose() {
    setName('');
    setRole('');
    setError('');
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit({ name, role: role || undefined });
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar funcionário');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Cadastrar Funcionário">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 border border-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="emp-name" className="block text-sm font-semibold text-text mb-2">
            Nome *
          </label>
          <input
            id="emp-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
            placeholder="Nome do funcionário"
          />
        </div>

        <div>
          <label htmlFor="emp-role" className="block text-sm font-semibold text-text mb-2">
            Cargo
          </label>
          <input
            id="emp-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-field"
            placeholder="Ex: Vendedor, Gerente"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-navy flex-1 disabled:opacity-60">
            {loading ? 'Salvando...' : 'Cadastrar'}
          </button>
          <button type="button" onClick={handleClose} className="btn-outline">
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
}
