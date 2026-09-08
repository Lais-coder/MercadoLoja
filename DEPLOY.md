# Deploy MercadoFácil

## Render (backend)

1. Web Service → **Settings** → **Root Directory** = `backend`
2. **Runtime** = Docker
3. **Region** = Oregon (mesmo do Postgres)
4. Variáveis:
   - `DATABASE_URL` = Internal Database URL
   - `JWT_SECRET` = string aleatória longa
   - `JWT_EXPIRES_IN` = `7d`
   - `CORS_ORIGIN` = `https://SEU-APP.vercel.app,http://localhost:5173`
   - `PUBLIC_API_URL` = `https://mercadoloja.onrender.com`
5. Shell após deploy: `npx tsx prisma/seed.ts`

## Vercel (frontend)

1. **Root Directory** = `frontend`
2. **Build** = `npm run build`
3. **Output** = `dist`
4. Variável: `VITE_API_URL` = `https://mercadoloja.onrender.com`
