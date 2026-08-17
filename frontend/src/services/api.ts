import type {
  Product,
  Highlight,
  AuthResponse,
  User,
  Store,
  CatalogItem,
  Employee,
  StorePromotion,
  AdminProduct,
  DashboardData,
  CreateStoreData,
  CreateCatalogData,
  UpdateCatalogData,
  CreateEmployeeData,
  CreatePromotionData,
  CreateStoreAccessData,
  CategoryType,
  StoreUser,
  BoxChallenge,
  CreateChallengeData,
} from '../types';

const API_ROOT = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
const API_BASE = API_ROOT ? `${API_ROOT}/api` : '/api';

export function resolveMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return API_ROOT ? `${API_ROOT}${url.startsWith('/') ? url : `/${url}`}` : url;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.headers,
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando (porta 3001).'
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || 'Erro na requisição');
  }

  return response.json();
}

async function fetchFormData<T>(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PATCH' = 'POST'
): Promise<T> {
  const token = localStorage.getItem('token');
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
  } catch {
    throw new Error(
      'Não foi possível conectar ao servidor. Verifique se o backend está rodando (porta 3001).'
    );
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(error.error || 'Erro na requisição');
  }

  return response.json();
}

export const api = {
  getHighlights: () => fetchApi<Highlight[]>('/highlights'),
  getFeaturedProducts: (limit = 6) =>
    fetchApi<Product[]>(`/products?featured=true&limit=${limit}`),
  getActivePromotions: (limit = 6) =>
    fetchApi<StorePromotion[]>(`/promotions?active=true&limit=${limit}`),
  getActiveChallenges: (limit = 6) =>
    fetchApi<BoxChallenge[]>(`/challenges?active=true&limit=${limit}`),
  getProductsByCategory: (category: CategoryType) =>
    fetchApi<Product[]>(`/products?category=${category}`),
  search: (q: string) =>
    fetchApi<{ products: Product[]; stores: Store[] }>(`/search?q=${encodeURIComponent(q)}`),
  getProducts: (featured = true) =>
    fetchApi<Product[]>(`/products${featured ? '?featured=true' : ''}`),
  login: (email: string, password: string) =>
    fetchApi<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => fetchApi<User>('/auth/me'),
  getMyStore: () => fetchApi<Store>('/my-store'),

  getStores: () => fetchApi<Store[]>('/stores'),
  getStore: (id: string) => fetchApi<Store>(`/stores/${id}`),
  getStoreRevista: (slug: string) => fetchApi<Store>(`/stores/revista/${slug}`),
  createStore: (data: CreateStoreData) =>
    fetchApi<Store>('/stores', { method: 'POST', body: JSON.stringify(data) }),

  getDashboard: () => fetchApi<DashboardData>('/admin/dashboard'),
  getAllEmployees: () => fetchApi<Employee[]>('/employees'),
  getAllProducts: () => fetchApi<AdminProduct[]>('/products'),
  getAllPromotions: () => fetchApi<StorePromotion[]>('/promotions'),

  getCatalog: (storeId: string) => fetchApi<CatalogItem[]>(`/stores/${storeId}/catalog`),
  createCatalogItem: (storeId: string, data: CreateCatalogData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('sizes', JSON.stringify(data.sizes));
    formData.append('price', String(data.price));
    if (data.featured) formData.append('featured', 'true');
    if (data.description) formData.append('description', data.description);
    data.photos.forEach((photo) => formData.append('photos', photo));
    return fetchFormData<CatalogItem>(`/stores/${storeId}/catalog`, formData);
  },

  createEmployee: (storeId: string, data: CreateEmployeeData) =>
    fetchApi<Employee>(`/stores/${storeId}/employees`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createPromotion: (storeId: string, data: CreatePromotionData) =>
    fetchApi<StorePromotion>(`/stores/${storeId}/promotions`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getStoreAccess: (storeId: string) =>
    fetchApi<StoreUser[]>(`/stores/${storeId}/access`),

  createStoreAccess: (storeId: string, data: CreateStoreAccessData) =>
    fetchApi<StoreUser>(`/stores/${storeId}/access`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAllChallenges: () => fetchApi<BoxChallenge[]>('/challenges'),
  createChallenge: (data: CreateChallengeData) =>
    fetchApi<BoxChallenge>('/challenges', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  createStoreChallenge: (storeId: string, data: Omit<CreateChallengeData, 'storeId'>) =>
    fetchApi<BoxChallenge>(`/stores/${storeId}/challenges`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProductFeatured: (storeId: string, productId: string, featured: boolean) =>
    fetchApi<CatalogItem>(`/stores/${storeId}/catalog/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ featured }),
    }),

  updateCatalogItem: (storeId: string, productId: string, data: UpdateCatalogData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('sizes', JSON.stringify(data.sizes));
    formData.append('price', String(data.price));
    if (data.description) formData.append('description', data.description);
    formData.append('featured', data.featured ? 'true' : 'false');
    if (data.keepImages) formData.append('keepImages', JSON.stringify(data.keepImages));
    (data.photos ?? []).forEach((photo) => formData.append('photos', photo));
    return fetchFormData<CatalogItem>(
      `/stores/${storeId}/catalog/${productId}`,
      formData,
      'PATCH'
    );
  },

  deleteCatalogItem: (storeId: string, productId: string) =>
    fetchApi<{ success: boolean }>(`/stores/${storeId}/catalog/${productId}`, {
      method: 'DELETE',
    }),
};

export function formatPrice(price: number): string {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export { getCategoryLabel } from '../lib/categories';

export function getStoreRevistaPath(slug: string): string {
  return `/revista/${slug}`;
}

export function getStoreRevistaUrl(slug: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${getStoreRevistaPath(slug)}`;
  }
  return getStoreRevistaPath(slug);
}

export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
