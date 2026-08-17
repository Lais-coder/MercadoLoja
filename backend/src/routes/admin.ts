import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { attachUser, requireAdmin, RoleRequest } from '../middleware/roles';

const router = Router();

router.use(authMiddleware, attachUser, requireAdmin);

router.get('/dashboard', async (_req, res: Response) => {
  try {
    const [
      storesCount,
      employeesCount,
      productsCount,
      promotionsCount,
      recentProducts,
      allProducts,
      priceStats,
    ] = await Promise.all([
      prisma.store.count(),
      prisma.employee.count(),
      prisma.product.count(),
      prisma.storePromotion.count({ where: { active: true } }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          store: { select: { id: true, name: true, boxNumber: true } },
        },
      }),
      prisma.product.findMany({
        where: { price: { gt: 0 } },
        select: { id: true, name: true, price: true, sizes: true, store: { select: { name: true, boxNumber: true } } },
        orderBy: { price: 'desc' },
      }),
      prisma.product.aggregate({
        where: { price: { gt: 0 } },
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true },
        _count: { id: true },
      }),
    ]);

    res.json({
      storesCount,
      employeesCount,
      productsCount,
      promotionsCount,
      recentProducts,
      allProducts,
      priceStats: {
        average: priceStats._avg.price ?? 0,
        min: priceStats._min.price ?? 0,
        max: priceStats._max.price ?? 0,
        count: priceStats._count.id,
      },
    });
  } catch (err) {
    console.error('Erro ao buscar dashboard:', err);
    res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
  }
});

export default router;
