import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res: Response) => {
  try {
    const { category, featured, limit } = req.query;
    const take = limit ? Math.min(Number(limit), 24) : undefined;

    const products = await prisma.product.findMany({
      where: {
        ...(category ? { store: { category: category as never } } : {}),
        ...(featured === 'true' ? { featured: true } : {}),
      },
      include: {
        store: {
          select: { id: true, name: true, slug: true, boxNumber: true, avatarLetter: true, whatsapp: true, category: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      ...(take ? { take } : {}),
    });

    res.json(products);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

export default router;
