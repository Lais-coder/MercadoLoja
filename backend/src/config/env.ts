import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: (
    process.env.CORS_ORIGIN ||
    'http://localhost:5173,http://localhost:5175,https://mercado-loja.vercel.app'
  )
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
};

/** Echo the request Origin so the browser always receives Access-Control-Allow-Origin. */
export function resolveCorsOrigin(origin: string | undefined): string {
  if (!origin) return '*';
  if (env.corsOrigin.includes(origin)) return origin;

  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return origin;
    if (hostname.endsWith('.vercel.app')) return origin;
  } catch {
    return env.corsOrigin[0] ?? '*';
  }

  return origin;
}
