import { Router, Response, Request } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { attachUser, requireStoreAccess, RoleRequest } from '../middleware/roles';

type StoreParams = { storeId: string };

const router = Router({ mergeParams: true });

router.get('/', async (req: Request<StoreParams>, res: Response) => {
  try {
    const { storeId } = req.params;
    const promotions = await prisma.storePromotion.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(promotions);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar chamativos' });
  }
});

router.post('/', authMiddleware, attachUser, requireStoreAccess, async (req: RoleRequest & Request<StoreParams>, res: Response) => {
  try {
    const { storeId } = req.params;
    const { title, description, active } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Título do chamativo é obrigatório' });
      return;
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      res.status(404).json({ error: 'Loja não encontrada' });
      return;
    }

    const promotion = await prisma.storePromotion.create({
      data: {
        title,
        description: description || null,
        active: active !== false,
        storeId,
      },
    });

    res.status(201).json(promotion);
  } catch {
    res.status(500).json({ error: 'Erro ao cadastrar chamativo' });
  }
});

export default router;
