import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { env } from './config/env';
import authRoutes from './routes/auth';
import highlightsRoutes from './routes/highlights';
import productsRoutes from './routes/products';
import storesRoutes from './routes/stores';
import catalogRoutes from './routes/catalog';
import employeesRoutes from './routes/employees';
import promotionsRoutes from './routes/promotions';
import adminRoutes from './routes/admin';
import employeesAllRoutes from './routes/employees-all';
import promotionsAllRoutes from './routes/promotions-all';
import challengesRoutes, { storeChallengesRouter } from './routes/challenges';
import myStoreRoutes, { storeAccessRouter } from './routes/my-store';
import searchRoutes from './routes/search';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'MercadoFácil API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/highlights', highlightsRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employees', employeesAllRoutes);
app.use('/api/promotions', promotionsAllRoutes);
app.use('/api/challenges', challengesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/my-store', myStoreRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/stores/:storeId/challenges', storeChallengesRouter);
app.use('/api/stores/:storeId/access', storeAccessRouter);
app.use('/api/stores/:storeId/catalog', catalogRoutes);
app.use('/api/stores/:storeId/employees', employeesRoutes);
app.use('/api/stores/:storeId/promotions', promotionsRoutes);

app.listen(env.port, '0.0.0.0', () => {
  console.log(`🚀 MercadoFácil API rodando na porta ${env.port}`);
});
