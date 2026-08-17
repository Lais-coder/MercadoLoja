export type CategoryType = 'MODA' | 'BELEZA' | 'ALIMENTACAO';
export type UserRole = 'ADMIN' | 'STORE';

export interface Employee {
  id: string;
  name: string;
  role?: string | null;
  storeId: string;
  store?: Pick<Store, 'id' | 'name' | 'boxNumber' | 'avatarLetter' | 'category'>;
}

export interface AdminProduct {
  id: string;
  name: string;
  sizes: string[];
  description?: string | null;
  price: number;
  imageUrl: string;
  featured: boolean;
  store: Pick<Store, 'id' | 'name' | 'boxNumber' | 'avatarLetter' | 'category'>;
  createdAt?: string;
}

export interface DashboardData {
  storesCount: number;
  employeesCount: number;
  productsCount: number;
  promotionsCount: number;
  recentProducts: AdminProduct[];
  allProducts: {
    id: string;
    name: string;
    price: number;
    sizes: string[];
    store: { name: string; boxNumber: string };
  }[];
  priceStats: {
    average: number;
    min: number;
    max: number;
    count: number;
  };
}

export interface StorePromotion {
  id: string;
  title: string;
  description?: string | null;
  active: boolean;
  storeId: string;
  createdAt?: string;
  store?: Pick<Store, 'id' | 'name' | 'slug' | 'boxNumber' | 'avatarLetter' | 'category' | 'whatsapp'>;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  boxNumber: string;
  category: CategoryType;
  avatarLetter: string;
  whatsapp?: string | null;
  logoUrl?: string | null;
  _count?: { products: number; employees: number; promotions: number };
  products?: CatalogItem[];
  employees?: Employee[];
  promotions?: StorePromotion[];
  challenges?: BoxChallenge[];
}

export interface CatalogItem {
  id: string;
  name: string;
  sizes: string[];
  description?: string | null;
  price: number;
  imageUrl: string;
  images: string[];
  featured: boolean;
  storeId: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sizes?: string[];
  featured: boolean;
  store: Pick<Store, 'id' | 'name' | 'slug' | 'boxNumber' | 'avatarLetter' | 'whatsapp'>;
}

export interface BoxChallenge {
  id: string;
  title: string;
  description?: string | null;
  discountPercent: number;
  couponCode: string;
  active: boolean;
  order?: number;
  storeId: string;
  store?: Pick<Store, 'id' | 'name' | 'slug' | 'boxNumber' | 'avatarLetter' | 'category' | 'whatsapp'>;
}

export interface CreateChallengeData {
  storeId?: string;
  title: string;
  description?: string;
  discountPercent: number;
  couponCode: string;
  order?: number;
}

export interface Highlight {
  id: string;
  title: string;
  imageUrl: string;
  category: CategoryType;
  boxNumber: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  storeId?: string | null;
}

export interface StoreUser {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateStoreData {
  name: string;
  boxNumber: string;
  category: CategoryType;
  avatarLetter: string;
  whatsapp?: string;
}

export interface CreateCatalogData {
  name: string;
  sizes: string[];
  description?: string;
  price: number;
  featured?: boolean;
  photos: File[];
}

export interface UpdateCatalogData {
  name: string;
  sizes: string[];
  description?: string;
  price: number;
  featured?: boolean;
  photos?: File[];
  keepImages?: string[];
}

export interface CreateEmployeeData {
  name: string;
  role?: string;
}

export interface CreatePromotionData {
  title: string;
  description?: string;
  active?: boolean;
}

export interface CreateStoreAccessData {
  name: string;
  email: string;
  password: string;
}
