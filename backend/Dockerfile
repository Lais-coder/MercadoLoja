FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

RUN mkdir -p uploads/products

ENV NODE_ENV=production
EXPOSE 3001

CMD ["sh", "-c", "npx prisma db push && node dist/index.js"]
