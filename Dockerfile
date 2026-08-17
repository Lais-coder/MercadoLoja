# Dockerfile na raiz — Render procura aqui quando Root Directory está vazio.
# Equivalente a backend/Dockerfile, com paths ajustados.

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY backend/package.json backend/package-lock.json* ./
RUN npm ci

COPY backend/prisma ./prisma
COPY backend/prisma.config.ts ./
RUN npx prisma generate

COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npm run build

RUN mkdir -p uploads/products

ENV NODE_ENV=production
EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
