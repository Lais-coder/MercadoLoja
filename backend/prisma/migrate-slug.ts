import 'dotenv/config';
import pg from 'pg';

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não configurada');
  }

  const client = new pg.Client({ connectionString });
  await client.connect();

  try {
    await client.query(`ALTER TABLE "Store" ADD COLUMN IF NOT EXISTS "slug" TEXT`);

    const { rows: stores } = await client.query<{ id: string; name: string; boxNumber: string; slug: string | null }>(
      `SELECT "id", "name", "boxNumber", "slug" FROM "Store" WHERE "slug" IS NULL`
    );

    const knownSlugs: Record<string, string> = {
      'store-ana': 'loja-da-dona-ana',
      'store-maria': 'dona-maria',
      'store-beleza': 'beleza-e-cia',
      'store-sabor': 'sabor-do-nordeste',
    };

    const used = new Set<string>();
    const { rows: existing } = await client.query<{ slug: string }>(
      `SELECT "slug" FROM "Store" WHERE "slug" IS NOT NULL`
    );
    existing.forEach((row) => used.add(row.slug));

    for (const store of stores) {
      let base = knownSlugs[store.id] ?? slugify(store.name) ?? `box-${store.boxNumber}`;
      let slug = base;
      let suffix = 1;

      while (used.has(slug)) {
        slug = `${base}-${suffix}`;
        suffix += 1;
      }

      used.add(slug);
      await client.query(`UPDATE "Store" SET "slug" = $1 WHERE "id" = $2`, [slug, store.id]);
      console.log(`✓ ${store.name} → ${slug}`);
    }

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Store_slug_key" ON "Store"("slug")
      WHERE "slug" IS NOT NULL
    `);

    console.log('\n✅ Migração de slug concluída. Agora rode: npx prisma db push');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
