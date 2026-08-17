import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function StoreRoute() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'login' | 'admin'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('login');
      return;
    }

    api
      .getMe()
      .then((user) => {
        if (user.role === 'STORE' && user.storeId) setStatus('ok');
        else if (user.role === 'ADMIN') setStatus('admin');
        else setStatus('login');
      })
      .catch(() => {
        localStorage.removeItem('token');
        setStatus('login');
      });
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-muted">
        <p className="text-muted">Carregando...</p>
      </div>
    );
  }

  if (status === 'login') return <Navigate to="/login" replace />;
  if (status === 'admin') return <Navigate to="/admin" replace />;

  return <Outlet />;
}
