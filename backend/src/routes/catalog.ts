import { Router, Response, Request } from 'express';
import { prisma } from '../lib/prisma';
import { authMiddleware } from '../middleware/auth';
import { attachUser, requireStoreAccess, RoleRequest } from '../middleware/roles';
import { uploadProductImages } from '../middleware/upload';

type CatalogParams = { storeId: string };

function parseKeepImages(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(String).filter(Boolean);
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return [];
    }
  }
  return [];
}

function parseSizes(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map(String).filter(Boolean);
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      return raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

const router = Router({ mergeParams: true });

router.get('/', async (req: Request<CatalogParams>, res: Response) => {
  try {
    const { storeId } = req.params;

    const products = await prisma.product.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
    });

    res.json(products);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar catálogo' });
  }
});

router.post(
  '/',
  authMiddleware,
  attachUser,
  requireStoreAccess,
  uploadProductImages.array('photos', 6),
  async (req: RoleRequest & Request<CatalogParams>, res: Response) => {
    try {
      const { storeId } = req.params;
      const { name, sizes, size, description, price, featured } = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      const productSizes = parseSizes(sizes);
      if (productSizes.length === 0 && size) {
        productSizes.push(String(size));
      }

      if (!name || productSizes.length === 0) {
        res.status(400).json({ error: 'Nome e pelo menos um tamanho são obrigatórios' });
        return;
      }

      const store = await prisma.store.findUnique({ where: { id: storeId } });
      if (!store) {
        res.status(404).json({ error: 'Loja não encontrada' });
        return;
      }

      const imagePaths = (files ?? []).map((f) => `/uploads/products/${f.filename}`);
      const imageUrl = imagePaths[0] ?? '';

      if (!imageUrl) {
        res.status(400).json({ error: 'Adicione pelo menos uma foto' });
        return;
      }

      const product = await prisma.product.create({
        data: {
          name,
          sizes: productSizes,
          description: description || null,
          price: price ? parseFloat(price) : 0,
          featured: featured === 'true' || featured === true,
          imageUrl,
          images: imagePaths,
          storeId,
        },
      });

      res.status(201).json(product);
    } catch {
      res.status(500).json({ error: 'Erro ao cadastrar peça no catálogo' });
    }
  }
);

router.patch(
  '/:productId',
  authMiddleware,
  attachUser,
  requireStoreAccess,
  uploadProductImages.array('photos', 6),
  async (req: RoleRequest & Request<CatalogParams & { productId: string }>, res: Response) => {
    try {
      const { storeId, productId } = req.params;
      const { name, sizes, size, description, price, featured, keepImages } = req.body;
      const files = req.files as Express.Multer.File[] | undefined;

      const existing = await prisma.product.findFirst({
        where: { id: productId, storeId },
      });

      if (!existing) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }

      const hasFullUpdate =
        name !== undefined ||
        sizes !== undefined ||
        size !== undefined ||
        description !== undefined ||
        price !== undefined ||
        keepImages !== undefined ||
        (files && files.length > 0);

      if (!hasFullUpdate && featured !== undefined) {
        const product = await prisma.product.update({
          where: { id: productId },
          data: { featured: featured === true || featured === 'true' },
        });
        res.json(product);
        return;
      }

      const productSizes = sizes !== undefined || size !== undefined ? parseSizes(sizes ?? size) : existing.sizes;
      if (productSizes.length === 0) {
        res.status(400).json({ error: 'Informe pelo menos um tamanho' });
        return;
      }

      let imagePaths: string[] = existing.images ?? [];
      if (keepImages !== undefined) {
        const kept = parseKeepImages(keepImages);
        imagePaths = kept.filter((img) => (existing.images ?? []).includes(img));
      }

      const newImagePaths = (files ?? []).map((f) => `/uploads/products/${f.filename}`);
      imagePaths = [...imagePaths, ...newImagePaths];

      if (imagePaths.length === 0) {
        res.status(400).json({ error: 'Mantenha ou adicione pelo menos uma foto' });
        return;
      }

      const parsedPrice =
        price !== undefined && price !== '' ? parseFloat(String(price)) : existing.price;

      if (price !== undefined && (isNaN(parsedPrice) || parsedPrice <= 0)) {
        res.status(400).json({ error: 'Informe um preço válido' });
        return;
      }

      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          name: name ?? existing.name,
          sizes: productSizes,
          description: description !== undefined ? description || null : existing.description,
          price: parsedPrice,
          featured:
            featured !== undefined
              ? featured === 'true' || featured === true
              : existing.featured,
          imageUrl: imagePaths[0],
          images: imagePaths,
        },
      });

      res.json(product);
    } catch {
      res.status(500).json({ error: 'Erro ao atualizar produto' });
    }
  }
);

router.delete(
  '/:productId',
  authMiddleware,
  attachUser,
  requireStoreAccess,
  async (req: RoleRequest & Request<CatalogParams & { productId: string }>, res: Response) => {
    try {
      const { storeId, productId } = req.params;

      const existing = await prisma.product.findFirst({
        where: { id: productId, storeId },
      });

      if (!existing) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }

      await prisma.product.delete({ where: { id: productId } });

      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Erro ao excluir produto' });
    }
  }
);

export default router;
