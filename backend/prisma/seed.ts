import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, CategoryType, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function backfillSlugs() {
  const stores = await prisma.store.findMany({ where: { slug: null } });

  for (const store of stores) {
    let base = slugify(store.name) || `box-${store.boxNumber}`;
    let slug = base;
    let suffix = 1;

    while (await prisma.store.findFirst({ where: { slug, NOT: { id: store.id } } })) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }

    await prisma.store.update({ where: { id: store.id }, data: { slug } });
  }
}

async function main() {
  await backfillSlugs();

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@mercadofacil.com' },
    update: { role: UserRole.ADMIN },
    create: {
      email: 'admin@mercadofacil.com',
      password: hashedPassword,
      name: 'Administrador',
      role: UserRole.ADMIN,
    },
  });

  const storePassword = await bcrypt.hash('loja123', 10);

  const stores = await Promise.all([
    prisma.store.upsert({
      where: { id: 'store-ana' },
      update: { slug: 'loja-da-dona-ana' },
      create: {
        id: 'store-ana',
        name: 'Loja da Dona Ana',
        slug: 'loja-da-dona-ana',
        boxNumber: '08',
        category: CategoryType.MODA,
        avatarLetter: 'A',
        whatsapp: '5585999990001',
      },
    }),
    prisma.store.upsert({
      where: { id: 'store-maria' },
      update: { slug: 'dona-maria' },
      create: {
        id: 'store-maria',
        name: 'Dona Maria',
        slug: 'dona-maria',
        boxNumber: '12',
        category: CategoryType.MODA,
        avatarLetter: 'M',
        whatsapp: '5585999990002',
      },
    }),
    prisma.store.upsert({
      where: { id: 'store-beleza' },
      update: { slug: 'beleza-e-cia' },
      create: {
        id: 'store-beleza',
        name: 'Beleza & Cia',
        slug: 'beleza-e-cia',
        boxNumber: '05',
        category: CategoryType.BELEZA,
        avatarLetter: 'B',
        whatsapp: '5585999990003',
      },
    }),
    prisma.store.upsert({
      where: { id: 'store-sabor' },
      update: { slug: 'sabor-do-nordeste' },
      create: {
        id: 'store-sabor',
        name: 'Sabor do Nordeste',
        slug: 'sabor-do-nordeste',
        boxNumber: '22',
        category: CategoryType.ALIMENTACAO,
        avatarLetter: 'S',
        whatsapp: '5585999990004',
      },
    }),
  ]);

  await prisma.user.upsert({
    where: { email: 'ana@mercadofacil.com' },
    update: { role: UserRole.STORE, storeId: 'store-ana' },
    create: {
      email: 'ana@mercadofacil.com',
      password: storePassword,
      name: 'Dona Ana',
      role: UserRole.STORE,
      storeId: 'store-ana',
    },
  });

  await prisma.product.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.storePromotion.deleteMany();
  await prisma.boxChallenge.deleteMany();
  await prisma.highlight.deleteMany();

  await prisma.product.createMany({
    data: [
      {
        name: 'Vestido de Verão Estampado',
        sizes: ['P', 'M', 'G'],
        description: 'Vestido leve com estampa floral, ideal para o verão.',
        price: 89.9,
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop'],
        featured: true,
        storeId: stores[0].id,
      },
      {
        name: 'Calça Jeans Skinny',
        sizes: ['38', '40', '42'],
        description: 'Calça jeans skinny azul escuro, modelagem moderna.',
        price: 119.9,
        imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop'],
        featured: true,
        storeId: stores[0].id,
      },
      {
        name: 'Saia Midi Plissada',
        sizes: ['P', 'M', 'G'],
        description: 'Saia midi plissada em tons neutros, versátil para o dia a dia.',
        price: 69.9,
        imageUrl: 'https://images.unsplash.com/photo-1583496664600-6e5b618f1d77?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1583496664600-6e5b618f1d77?w=400&h=400&fit=crop'],
        featured: false,
        storeId: stores[0].id,
      },
      {
        name: 'Camisa Social Feminina',
        sizes: ['P', 'M', 'G', 'GG'],
        description: 'Camisa social branca, tecido leve e confortável.',
        price: 79.9,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop'],
        featured: false,
        storeId: stores[0].id,
      },
      {
        name: 'Short Jeans Destroyed',
        sizes: ['P', 'M', 'G'],
        description: 'Short jeans com detalhe destroyed, perfeito para o calor.',
        price: 59.9,
        imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop'],
        featured: true,
        storeId: stores[0].id,
      },
      {
        name: 'Conjunto Moletom Feminino',
        sizes: ['P', 'M', 'G'],
        description: 'Conjunto moletom blusa e calça, ideal para dias frescos.',
        price: 149.9,
        imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop'],
        featured: false,
        storeId: stores[0].id,
      },
      {
        name: 'Blusa Regata Básica',
        sizes: ['P', 'M', 'G', 'GG'],
        description: 'Blusa regata básica em algodão, várias cores.',
        price: 29.9,
        imageUrl: 'https://images.unsplash.com/photo-1564257631407-3deb25fec08a?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1564257631407-3deb25fec08a?w=400&h=400&fit=crop'],
        featured: false,
        storeId: stores[0].id,
      },
      {
        name: 'Macacão Linho',
        sizes: ['P', 'M', 'G'],
        description: 'Macacão de linho bege, elegante e confortável.',
        price: 129.9,
        imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'],
        featured: true,
        storeId: stores[0].id,
      },
      {
        name: 'Kit Maquiagem Completo',
        sizes: ['Único'],
        description: 'Kit com batom, sombra e blush.',
        price: 129.9,
        imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'],
        featured: true,
        storeId: stores[2].id,
      },
      {
        name: 'Tapioca Artesanal (6un)',
        sizes: ['6 unidades'],
        description: 'Tapiocas recheadas feitas na hora.',
        price: 24.9,
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop'],
        featured: true,
        storeId: stores[3].id,
      },
      {
        name: 'Blusa Cropped Floral',
        sizes: ['P', 'M'],
        description: 'Blusa cropped com estampa floral delicada.',
        price: 49.9,
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop'],
        featured: true,
        storeId: stores[1].id,
      },
      {
        name: 'Perfume Importado 50ml',
        sizes: ['50ml'],
        description: 'Fragrância importada de longa duração.',
        price: 159.9,
        imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop'],
        featured: true,
        storeId: stores[2].id,
      },
      {
        name: 'Bolo de Rolo Tradicional',
        sizes: ['500g'],
        description: 'Bolo de rolo caseiro com goiabada.',
        price: 35.0,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop',
        images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop'],
        featured: true,
        storeId: stores[3].id,
      },
    ],
  });

  await prisma.employee.createMany({
    data: [
      { name: 'Ana Paula', role: 'Proprietária', storeId: stores[0].id },
      { name: 'Carlos', role: 'Vendedor', storeId: stores[0].id },
      { name: 'Maria Silva', role: 'Proprietária', storeId: stores[1].id },
      { name: 'João', role: 'Vendedor', storeId: stores[1].id },
      { name: 'Fernanda', role: 'Atendente', storeId: stores[2].id },
      { name: 'Roberto', role: 'Proprietário', storeId: stores[3].id },
    ],
  });

  await prisma.storePromotion.createMany({
    data: [
      {
        title: 'Promoção de Verão — 20% off em vestidos',
        description: 'Válido até domingo. Peças selecionadas com desconto.',
        storeId: stores[0].id,
      },
      {
        title: 'Liquidação de inverno — Box 12',
        description: 'Renove o guarda-roupa com preços especiais.',
        storeId: stores[1].id,
      },
      {
        title: 'Kit beleza com 15% de desconto',
        description: 'Monte seu kit e ganhe desconto na compra.',
        storeId: stores[2].id,
      },
      {
        title: 'Tapioca + caldo de cana por R$ 10',
        description: 'Combo especial da semana no box 22.',
        storeId: stores[3].id,
      },
    ],
  });

  await prisma.boxChallenge.createMany({
    data: [
      {
        title: 'Vá ao Box 08',
        description: 'Visite a Loja da Dona Ana e ganhe desconto na compra!',
        discountPercent: 5,
        couponCode: 'BOX08',
        order: 1,
        storeId: stores[0].id,
      },
      {
        title: 'Desafio Box 05',
        description: 'Conheça a Beleza & Cia e leve um mimo especial.',
        discountPercent: 10,
        couponCode: 'BELEZA10',
        order: 2,
        storeId: stores[2].id,
      },
      {
        title: 'Missão Box 22',
        description: 'Prove as delícias do Sabor do Nordeste com desconto.',
        discountPercent: 15,
        couponCode: 'SABOR15',
        order: 3,
        storeId: stores[3].id,
      },
    ],
  });

  await prisma.highlight.createMany({
    data: [
      {
        title: 'Renove o guarda-roupa com a Dona Maria - Box 12',
        imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6a68756d7?w=600&h=400&fit=crop',
        category: CategoryType.MODA,
        boxNumber: '12',
        order: 1,
      },
      {
        title: 'Beleza com preço justo - Box 05',
        imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop',
        category: CategoryType.BELEZA,
        boxNumber: '05',
        order: 2,
      },
      {
        title: 'Sabores do Nordeste - Box 22',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop',
        category: CategoryType.ALIMENTACAO,
        boxNumber: '22',
        order: 3,
      },
    ],
  });

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
