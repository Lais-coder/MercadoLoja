import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { attachUser, requireAdmin, requireStoreUser, RoleRequest } from '../middleware/roles';

const router = Router();

router.get('/', authMiddleware, attachUser, requireStoreUser, async (req: RoleRequest, res: Response) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.user!.storeId! },
      include: {
        products: { orderBy: { createdAt: 'desc' } },
        employees: { orderBy: { name: 'asc' } },
        promotions: { orderBy: { createdAt: 'desc' } },
        challenges: { orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] },
        _count: { select: { products: true, employees: true, promotions: true } },
      },
    });

    if (!store) {
      res.status(404).json({ error: 'Loja não encontrada' });
      return;
    }

    res.json(store);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar perfil da loja' });
  }
});

export default router;

export const storeAccessRouter = Router({ mergeParams: true });

storeAccessRouter.get(
  '/',
  authMiddleware,
  attachUser,
  requireAdmin,
  async (req: RoleRequest, res: Response) => {
    try {
      const { storeId } = req.params;

      const users = await prisma.user.findMany({
        where: { storeId, role: 'STORE' },
        select: { id: true, email: true, name: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
      });

      res.json(users);
    } catch {
      res.status(500).json({ error: 'Erro ao buscar acessos da loja' });
    }
  }
);

storeAccessRouter.post(
  '/',
  authMiddleware,
  attachUser,
  requireAdmin,
  async (req: RoleRequest, res: Response) => {
    try {
      const { storeId } = req.params;
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        return;
      }

      const store = await prisma.store.findUnique({ where: { id: storeId } });
      if (!store) {
        res.status(404).json({ error: 'Loja não encontrada' });
        return;
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        res.status(409).json({ error: 'Email já cadastrado' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'STORE',
          storeId,
        },
        select: { id: true, email: true, name: true, createdAt: true },
      });

      res.status(201).json(user);
    } catch {
      res.status(500).json({ error: 'Erro ao criar acesso da loja' });
    }
  }
);
