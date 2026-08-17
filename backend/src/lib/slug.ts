import { prisma } from './prisma';

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = slugify(name) || 'loja';
  let slug = base;
  let suffix = 1;

  while (await prisma.store.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}
