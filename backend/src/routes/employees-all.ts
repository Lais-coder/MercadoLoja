import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (_req, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        store: {
          select: { id: true, name: true, boxNumber: true, avatarLetter: true, category: true },
        },
      },
      orderBy: [{ store: { name: 'asc' } }, { name: 'asc' }],
    });

    res.json(employees);
  } catch (err) {
    console.error('Erro ao buscar funcionários:', err);
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

export default router;
