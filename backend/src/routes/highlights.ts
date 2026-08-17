import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res: Response) => {
  try {
    const highlights = await prisma.highlight.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });
    res.json(highlights);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar destaques' });
  }
});

router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { title, imageUrl, category, boxNumber, order } = req.body;
    const highlight = await prisma.highlight.create({
      data: { title, imageUrl, category, boxNumber, order: order ?? 0 },
    });
    res.status(201).json(highlight);
  } catch {
    res.status(500).json({ error: 'Erro ao criar destaque' });
  }
});

export default router;
