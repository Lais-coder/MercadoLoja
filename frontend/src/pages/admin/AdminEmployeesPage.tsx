import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { api, getCategoryLabel } from '../../services/api';
import type { Employee } from '../../types';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    api
      .getAllEmployees()
      .then(setEmployees)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar funcionários'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.store?.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="heading-section">Funcionários</h1>
          <p className="text-muted mt-1">
            {employees.length} funcionário(s) em todas as lojas
          </p>
        </div>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, loja ou cargo..."
          className="input-field max-w-xs"
        />
      </div>

      {loading && <p className="text-muted">Carregando...</p>}

      {error && (
        <div className="card p-6 text-center text-red-600">{error}</div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="card p-12 text-center">
          <Users className="w-12 h-12 text-text-light mx-auto mb-4" />
          <p className="text-text font-semibold">Nenhum funcionário encontrado</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-muted border-b border-border/60">
                  <th className="text-left py-3 px-5 font-semibold text-text-muted">Funcionário</th>
                  <th className="text-left py-3 px-5 font-semibold text-text-muted">Cargo</th>
                  <th className="text-left py-3 px-5 font-semibold text-text-muted">Loja</th>
                  <th className="text-left py-3 px-5 font-semibold text-text-muted">Box</th>
                  <th className="text-left py-3 px-5 font-semibold text-text-muted">Categoria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((emp) => (
                  <tr key={emp.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-navy/8 flex items-center justify-center text-navy font-semibold text-sm">
                          {emp.name.charAt(0)}
                        </div>
                        <span className="font-medium text-text">{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="text-muted">{emp.role || '—'}</span>
                    </td>
                    <td className="py-4 px-5">
                      {emp.store ? (
                        <Link
                          to={`/admin/lojas/${emp.store.id}`}
                          className="text-navy font-medium hover:underline"
                        >
                          {emp.store.name}
                        </Link>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-4 px-5 text-muted">{emp.store?.boxNumber ?? '—'}</td>
                    <td className="py-4 px-5">
                      {emp.store?.category ? (
                        <span className="text-xs font-semibold text-navy bg-navy/8 px-2.5 py-1 rounded-full">
                          {getCategoryLabel(emp.store.category)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
