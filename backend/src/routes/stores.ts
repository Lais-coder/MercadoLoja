import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { attachUser, requireAdmin, RoleRequest } from '../middleware/roles';
import { generateUniqueSlug } from '../lib/slug';

const router = Router();

const publicStoreInclude = {
  products: { orderBy: { createdAt: 'desc' as const } },
  promotions: {
    where: { active: true },
    orderBy: { createdAt: 'desc' as const },
  },
  challenges: {
    where: { active: true },
    orderBy: [{ order: 'asc' as const }, { createdAt: 'desc' as const }],
  },
  _count: { select: { products: true, promotions: true, challenges: true } },
};

router.get('/', async (req, res: Response) => {  try {
    const { category } = req.query;

    const stores = await prisma.store.findMany({
      where: category ? { category: category as never } : undefined,
      include: {
        _count: { select: { products: true, employees: true, promotions: true } },
      },
      orderBy: { boxNumber: 'asc' },
    });

    res.json(stores);
  } catch (err) {
    console.error('Erro ao buscar lojas:', err);
    res.status(500).json({ error: 'Erro ao buscar lojas' });
  }
});

router.get('/revista/:slug', async (req, res: Response) => {
  try {
    const store = await prisma.store.findUnique({
      where: { slug: req.params.slug },
      include: publicStoreInclude,
    });

    if (!store) {
      res.status(404).json({ error: 'Loja não encontrada' });
      return;
    }

    res.json(store);
  } catch (err) {
    console.error('Erro ao buscar revista da loja:', err);
    res.status(500).json({ error: 'Erro ao buscar revista da loja' });
  }
});

router.get('/:id', async (req, res: Response) => {  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.id },
      include: {
        products: { orderBy: { createdAt: 'desc' } },
        employees: { orderBy: { name: 'asc' } },
        promotions: { orderBy: { createdAt: 'desc' } },
        _count: { select: { products: true, employees: true, promotions: true } },
      },
    });

    if (!store) {
      res.status(404).json({ error: 'Loja não encontrada' });
      return;
    }

    res.json(store);
  } catch (err) {
    console.error('Erro ao buscar loja:', err);
    res.status(500).json({ error: 'Erro ao buscar loja' });
  }
});

router.post('/', authMiddleware, attachUser, requireAdmin, async (req: RoleRequest, res: Response) => {
  try {
    const { name, boxNumber, category, avatarLetter, whatsapp } = req.body;

    if (!name || !boxNumber || !category || !avatarLetter) {
      res.status(400).json({ error: 'Nome, box, categoria e letra do avatar são obrigatórios' });
      return;
    }

    const store = await prisma.store.create({
      data: {
        name,
        slug: await generateUniqueSlug(name),
        boxNumber,
        category,
        avatarLetter: avatarLetter.toUpperCase().slice(0, 1),
        whatsapp: whatsapp || null,
      },
    });

    res.status(201).json(store);
  } catch {
    res.status(500).json({ error: 'Erro ao criar loja' });
  }
});

export default router;
