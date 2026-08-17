import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import PublicStoreRevistaPage from './pages/PublicStoreRevistaPage';
import RevistasOnlinePage from './pages/RevistasOnlinePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import AdminRoute from './components/admin/AdminRoute';
import StoreRoute from './components/store/StoreRoute';
import AdminLayout from './components/admin/AdminLayout';
import StoreLayout from './components/store/StoreLayout';
import StoreOverviewPage from './pages/store/StoreOverviewPage';
import StoreCatalogPage from './pages/store/StoreCatalogPage';
import StorePromotionsPage from './pages/store/StorePromotionsPage';
import StoreChallengesPage from './pages/store/StoreChallengesPage';
import StoreBoostPage from './pages/store/StoreBoostPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminStoresPage from './pages/admin/AdminStoresPage';
import AdminEmployeesPage from './pages/admin/AdminEmployeesPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage';
import AdminChallengesPage from './pages/admin/AdminChallengesPage';
import NewStorePage from './pages/admin/NewStorePage';
import StoreDetailPage from './pages/admin/StoreDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors closeButton duration={4000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/moda" element={<CategoryPage />} />
        <Route path="/beleza" element={<CategoryPage />} />
        <Route path="/alimentacao" element={<CategoryPage />} />
        <Route path="/revista/:slug" element={<PublicStoreRevistaPage />} />
        <Route path="/revistas" element={<RevistasOnlinePage />} />
        <Route path="/busca" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="lojas" element={<AdminStoresPage />} />
            <Route path="lojas/nova" element={<NewStorePage />} />
            <Route path="lojas/:id" element={<StoreDetailPage />} />
            <Route path="funcionarios" element={<AdminEmployeesPage />} />
            <Route path="produtos" element={<AdminProductsPage />} />
            <Route path="chamativos" element={<AdminPromotionsPage />} />
            <Route path="desafios" element={<AdminChallengesPage />} />
          </Route>
        </Route>

        <Route element={<StoreRoute />}>
          <Route path="/loja" element={<StoreLayout />}>
            <Route index element={<StoreOverviewPage />} />
            <Route path="catalogo" element={<StoreCatalogPage />} />
            <Route path="impulsionar" element={<StoreBoostPage />} />
            <Route path="chamativos" element={<StorePromotionsPage />} />
            <Route path="desafios" element={<StoreChallengesPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
