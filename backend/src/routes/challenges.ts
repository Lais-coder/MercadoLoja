import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { getRouteParam } from '../lib/params';
import { authMiddleware } from '../middleware/auth';
import { attachUser, requireAdmin, requireStoreAccess, RoleRequest } from '../middleware/roles';

const router = Router();

const storeSelect = {
  id: true,
  name: true,
  slug: true,
  boxNumber: true,
  avatarLetter: true,
  category: true,
  whatsapp: true,
} as const;

router.get('/', async (req, res: Response) => {
  try {
    const { active, limit } = req.query;
    const take = limit ? Math.min(Number(limit), 12) : undefined;

    const challenges = await prisma.boxChallenge.findMany({
      where: active === 'true' ? { active: true } : undefined,
      include: { store: { select: storeSelect } },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      ...(take ? { take } : {}),
    });

    res.json(challenges);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar desafios' });
  }
});

router.post('/', authMiddleware, attachUser, requireAdmin, async (req: RoleRequest, res: Response) => {
  try {
    const { storeId, title, description, discountPercent, couponCode, order } = req.body;

    if (!storeId || !title || discountPercent == null || !couponCode) {
      res.status(400).json({ error: 'Loja, título, desconto e código são obrigatórios' });
      return;
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      res.status(404).json({ error: 'Loja não encontrada' });
      return;
    }

    const challenge = await prisma.boxChallenge.create({
      data: {
        storeId,
        title,
        description: description || null,
        discountPercent: Number(discountPercent),
        couponCode: String(couponCode).toUpperCase(),
        order: order ? Number(order) : 0,
      },
      include: { store: { select: storeSelect } },
    });

    res.status(201).json(challenge);
  } catch {
    res.status(500).json({ error: 'Erro ao criar desafio' });
  }
});

export const storeChallengesRouter = Router({ mergeParams: true });

storeChallengesRouter.get('/', async (req, res: Response) => {
  try {
    const storeId = getRouteParam(req.params, 'storeId');
    const challenges = await prisma.boxChallenge.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(challenges);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar desafios da loja' });
  }
});

storeChallengesRouter.post(
  '/',
  authMiddleware,
  attachUser,
  requireStoreAccess,
  async (req: RoleRequest, res: Response) => {
    try {
      const storeId = getRouteParam(req.params, 'storeId');
      const { title, description, discountPercent, couponCode } = req.body;

      if (!title || discountPercent == null || !couponCode) {
        res.status(400).json({ error: 'Título, desconto e código são obrigatórios' });
        return;
      }

      const challenge = await prisma.boxChallenge.create({
        data: {
          storeId,
          title,
          description: description || null,
          discountPercent: Number(discountPercent),
          couponCode: String(couponCode).toUpperCase(),
        },
        include: { store: { select: storeSelect } },
      });

      res.status(201).json(challenge);
    } catch {
      res.status(500).json({ error: 'Erro ao criar desafio' });
    }
  }
);

export default router;
