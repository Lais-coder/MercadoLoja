import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AuthRequest } from './auth';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  storeId: string | null;
}

export interface RoleRequest extends AuthRequest {
  user?: AuthenticatedUser;
}

export async function attachUser(req: RoleRequest, res: Response, next: NextFunction) {
  if (!req.userId) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, email: true, name: true, role: true, storeId: true },
    });

    if (!user) {
      res.status(401).json({ error: 'Usuário não encontrado' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(500).json({ error: 'Erro ao validar usuário' });
  }
}

export function requireAdmin(req: RoleRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== UserRole.ADMIN) {
    res.status(403).json({ error: 'Acesso restrito ao administrador' });
    return;
  }
  next();
}

export function requireStoreAccess(req: RoleRequest, res: Response, next: NextFunction) {
  const storeId = req.params.storeId;

  if (!storeId) {
    res.status(400).json({ error: 'Loja não informada' });
    return;
  }

  if (req.user?.role === UserRole.ADMIN) {
    next();
    return;
  }

  if (req.user?.role === UserRole.STORE && req.user.storeId === storeId) {
    next();
    return;
  }

  res.status(403).json({ error: 'Acesso negado a esta loja' });
}

export function requireStoreUser(req: RoleRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== UserRole.STORE || !req.user.storeId) {
    res.status(403).json({ error: 'Acesso restrito a lojistas' });
    return;
  }
  next();
}
