import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { seedDemoData } from '../src/lib/seedDemo';

function isPostgresUrl(url: string | undefined): boolean {
  return !!url && /^postgres(ql)?:\/\//i.test(url);
}

async function main() {
  if (!isPostgresUrl(process.env.DATABASE_URL)) {
    console.error(`
DATABASE_URL inválida.

Não cole o texto de exemplo. A URL tem que começar com postgresql://

Opção mais fácil (depois do deploy): rode o seed pela API, como o cadastro do admin:

  Invoke-RestMethod -Uri "https://mercadoloja.onrender.com/api/auth/seed-demo" -Method POST -ContentType "application/json" -Body '{"email":"admin@mercadofacil.com","password":"admin123"}'
`);
    process.exit(1);
  }

  const result = await seedDemoData();
  console.log(`✅ ${result.message}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
