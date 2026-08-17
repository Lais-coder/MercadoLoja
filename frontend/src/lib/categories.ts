import type { CategoryType } from '../types';

export const categoryConfig: Record<
  CategoryType,
  { label: string; badgeClass: string; iconBg: string; slug: string }
> = {
  MODA: {
    label: 'Moda',
    badgeClass: 'badge-moda',
    iconBg: 'bg-blue-50 text-blue-600',
    slug: 'moda',
  },
  BELEZA: {
    label: 'Beleza',
    badgeClass: 'badge-beleza',
    iconBg: 'bg-pink-50 text-pink-600',
    slug: 'beleza',
  },
  ALIMENTACAO: {
    label: 'Alimentação',
    badgeClass: 'badge-alimentacao',
    iconBg: 'bg-emerald-50 text-emerald-600',
    slug: 'alimentacao',
  },
};

export const slugToCategory: Record<string, CategoryType> = {
  moda: 'MODA',
  beleza: 'BELEZA',
  alimentacao: 'ALIMENTACAO',
};

export function getCategoryFromSlug(slug: string): CategoryType | null {
  return slugToCategory[slug] ?? null;
}

export function getCategoryLabel(category: string): string {
  return categoryConfig[category as CategoryType]?.label ?? category;
}
