import { Router, Response, Request } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { attachUser, requireStoreAccess, RoleRequest } from '../middleware/roles';

type StoreParams = { storeId: string };

const router = Router({ mergeParams: true });

router.get('/', async (req: Request<StoreParams>, res: Response) => {
  try {
    const { storeId } = req.params;
    const employees = await prisma.employee.findMany({
      where: { storeId },
      orderBy: { name: 'asc' },
    });
    res.json(employees);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

router.post('/', authMiddleware, attachUser, requireStoreAccess, async (req: RoleRequest & Request<StoreParams>, res: Response) => {
  try {
    const { storeId } = req.params;
    const { name, role } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Nome do funcionário é obrigatório' });
      return;
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      res.status(404).json({ error: 'Loja não encontrada' });
      return;
    }

    const employee = await prisma.employee.create({
      data: { name, role: role || null, storeId },
    });

    res.status(201).json(employee);
  } catch {
    res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
  }
});

export default router;
