import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res: Response) => {
  try {
    const { active, limit } = req.query;
    const take = limit ? Math.min(Number(limit), 24) : undefined;

    const promotions = await prisma.storePromotion.findMany({
      where: {
        ...(active === 'true' ? { active: true } : {}),
      },
      include: {
        store: {
          select: { id: true, name: true, slug: true, boxNumber: true, avatarLetter: true, category: true, whatsapp: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      ...(take ? { take } : {}),
    });

    res.json(promotions);
  } catch (err) {
    console.error('Erro ao buscar chamativos:', err);
    res.status(500).json({ error: 'Erro ao buscar chamativos' });
  }
});

export default router;
