# Revista MercadoFácil

Landing page digital do Centro Público Comercial Geraldo Machado em Maracanaú — uma revista virtual que exibe lojas, destaques da semana e vitrines virtuais dos permissionários.

## Stack

| Camada | Tecnologias |
|--------|-------------|
| Frontend | React, Vite, TypeScript, Tailwind CSS, Lucide React, React Router DOM |
| Backend | Node.js, Express, TypeScript |
| Banco | PostgreSQL + Prisma ORM |
| Segurança | JWT, Bcrypt, CORS, Helmet, dotenv |

## Estrutura do Projeto

```
Mercado/
├── frontend/          # Landing page React
├── backend/           # API REST Express
│   ├── prisma/        # Schema e migrations
│   └── src/           # Rotas e middleware
└── README.md
```

## Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente

## Configuração

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edite DATABASE_URL no .env com suas credenciais PostgreSQL

npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

A API estará em `http://localhost:3001`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

A landing page estará em `http://localhost:5173`.

## Credenciais de Admin (seed)

- **Email:** admin@mercadofacil.com
- **Senha:** admin123

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/health` | Status da API |
| GET | `/api/highlights` | Destaques da semana |
| GET | `/api/products?featured=true` | Produtos em destaque |
| GET | `/api/stores` | Lista de lojas |
| POST | `/api/auth/login` | Login (JWT) |
| POST | `/api/auth/register` | Registro de admin |
| GET | `/api/auth/me` | Usuário autenticado |

## Seções da Landing Page

1. **Header** — Logo, navegação (Moda, Beleza, Alimentação, Sobre), busca e login
2. **Hero** — Banner com busca e CTA "Ver ofertas de hoje"
3. **Destaques da Semana** — Cards com ofertas em destaque
4. **Categorias** — Moda, Beleza, Alimentação
5. **Vitrine Virtual** — Produtos com botão WhatsApp
6. **Localização** — Endereço, horários e mapa
7. **Footer** — Copyright e links legais
