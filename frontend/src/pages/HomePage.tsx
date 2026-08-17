import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WeeklyHighlights from '../components/WeeklyHighlights';
import DailyPromotions from '../components/DailyPromotions';
import BoxChallengeBoard from '../components/BoxChallengeBoard';
import CategoryGrid from '../components/CategoryGrid';
import VirtualShowcase from '../components/VirtualShowcase';
import LocationSection from '../components/LocationSection';
import Footer from '../components/Footer';
import { api } from '../services/api';
import type { Highlight, Product, StorePromotion, BoxChallenge } from '../types';

const fallbackHighlights: Highlight[] = [
  {
    id: '1',
    title: 'Renove o guarda-roupa com a Dona Maria - Box 12',
    imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6a68756d7?w=600&h=400&fit=crop',
    category: 'MODA',
    boxNumber: '12',
  },
  {
    id: '2',
    title: 'Beleza com preço justo - Box 05',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop',
    category: 'BELEZA',
    boxNumber: '05',
  },
  {
    id: '3',
    title: 'Sabores do Nordeste - Box 22',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
    category: 'ALIMENTACAO',
    boxNumber: '22',
  },
];

const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Vestido de Verão Estampado',
    price: 89.9,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
    featured: true,
    store: { id: '1', name: 'Loja da Dona Ana', slug: 'loja-da-dona-ana', boxNumber: '08', avatarLetter: 'A', whatsapp: '5585999990001' },
  },
  {
    id: '2',
    name: 'Kit Maquiagem Completo',
    price: 129.9,
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
    featured: true,
    store: { id: '2', name: 'Beleza & Cia', slug: 'beleza-e-cia', boxNumber: '05', avatarLetter: 'B', whatsapp: '5585999990003' },
  },
  {
    id: '3',
    name: 'Tapioca Artesanal (6un)',
    price: 24.9,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
    featured: true,
    store: { id: '3', name: 'Sabor do Nordeste', slug: 'sabor-do-nordeste', boxNumber: '22', avatarLetter: 'S', whatsapp: '5585999990004' },
  },
];

export default function HomePage() {
  const [highlights, setHighlights] = useState<Highlight[]>(fallbackHighlights);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [promotions, setPromotions] = useState<StorePromotion[]>([]);
  const [challenges, setChallenges] = useState<BoxChallenge[]>([]);

  useEffect(() => {
    api.getHighlights().then(setHighlights).catch(() => {});
    api.getFeaturedProducts(6).then(setProducts).catch(() => {});
    api.getActivePromotions(6).then(setPromotions).catch(() => {});
    api.getActiveChallenges(6).then(setChallenges).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <WeeklyHighlights highlights={highlights} />
        <DailyPromotions promotions={promotions} />
        <BoxChallengeBoard challenges={challenges} />
        <CategoryGrid />
        <VirtualShowcase products={products} />
        <LocationSection />
      </main>
      <Footer />
    </>
  );
}
