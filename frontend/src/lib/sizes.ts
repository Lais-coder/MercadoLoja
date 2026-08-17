export const PRODUCT_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XG', 'Único'] as const;

export type ProductSize = (typeof PRODUCT_SIZES)[number];

export function formatSizes(sizes: string[]): string {
  if (sizes.length === 0) return '—';
  return sizes.join(', ');
}
