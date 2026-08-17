import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Store } from '../types';

export function useMyStore() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(() => {
    setLoading(true);
    api
      .getMyStore()
      .then(setStore)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar loja'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { store, loading, error, reload };
}
