import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function ProtectedRoute() {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('unauthenticated');
      return;
    }

    api.getMe()
      .then(() => setStatus('authenticated'))
      .catch(() => {
        localStorage.removeItem('token');
        setStatus('unauthenticated');
      });
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-muted">
        <p className="text-muted">Carregando...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
