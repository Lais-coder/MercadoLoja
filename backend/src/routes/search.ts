import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res: Response) => {
  try {
    const q = String(req.query.q ?? '').trim();

    if (!q) {
      res.json({ products: [], stores: [] });
      return;
    }

    const [products, stores] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { store: { name: { contains: q, mode: 'insensitive' } } },
            { store: { boxNumber: { contains: q, mode: 'insensitive' } } },
          ],
        },
        include: {
          store: {
            select: {
              id: true,
              name: true,
              slug: true,
              boxNumber: true,
              avatarLetter: true,
              whatsapp: true,
              category: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 24,
      }),
      prisma.store.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { boxNumber: { contains: q, mode: 'insensitive' } },
            { slug: { contains: q, mode: 'insensitive' } },
          ],
        },
        include: {
          _count: { select: { products: true, promotions: true } },
        },
        orderBy: { boxNumber: 'asc' },
        take: 12,
      }),
    ]);

    res.json({ products, stores });
  } catch {
    res.status(500).json({ error: 'Erro na busca' });
  }
});

export default router;
