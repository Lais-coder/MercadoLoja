export function paramAsString(value: string | string[] | undefined): string {
  if (value === undefined) return '';
  return Array.isArray(value) ? (value[0] ?? '') : value;
}

export function getRouteParam(
  params: Record<string, string | string[] | undefined>,
  key: string
): string {
  return paramAsString(params[key]);
}
