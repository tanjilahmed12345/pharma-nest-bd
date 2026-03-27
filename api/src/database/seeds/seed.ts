import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { usersSeedData } from './seed-data/users.seed';
import { categoriesSeedData } from './seed-data/categories.seed';
import { brandsSeedData } from './seed-data/brands.seed';
import { productsSeedData } from './seed-data/products.seed';
import { settingsSeedData } from './seed-data/settings.seed';
import { locationsSeedData } from './seed-data/locations.seed';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('🌱 Starting database seed...\n');

  // --- Users ---
  console.log('👤 Seeding users...');
  for (const user of usersSeedData) {
    const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role as any,
        passwordHash: hash,
        status: 'ACTIVE',
      },
    });
  }
  console.log(`   ✓ ${usersSeedData.length} users seeded`);

  // --- Categories ---
  console.log('📁 Seeding categories...');
  const categoryMap: Record<string, string> = {};
  for (const cat of categoriesSeedData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`   ✓ ${categoriesSeedData.length} categories seeded`);

  // --- Brands ---
  console.log('🏷️  Seeding brands...');
  const brandMap: Record<string, string> = {};
  for (const brand of brandsSeedData) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {},
      create: {
        name: brand.name,
        slug: brand.slug,
        manufacturerName: brand.manufacturerName,
        isActive: true,
      },
    });
    brandMap[brand.slug] = created.id;
  }
  console.log(`   ✓ ${brandsSeedData.length} brands seeded`);

  // --- Products ---
  console.log('💊 Seeding products...');
  for (const prod of productsSeedData) {
    const categoryId = categoryMap[prod.category];
    if (!categoryId) {
      console.warn(`   ⚠ Category "${prod.category}" not found for product "${prod.name}"`);
      continue;
    }

    const brandSlug = prod.brand?.toLowerCase().replace(/\s+/g, '-');
    const brandId = brandSlug ? brandMap[brandSlug] || null : null;

    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        name: prod.name,
        slug: prod.slug,
        genericName: prod.genericName,
        manufacturerName: prod.manufacturer,
        categoryId,
        brandId,
        dosageForm: prod.dosageForm as any,
        strength: prod.strength,
        packSize: prod.packSize,
        price: prod.price,
        discountPrice: prod.discountPrice || null,
        stockQty: prod.stockQty,
        isPrescriptionRequired: prod.isPrescriptionRequired,
        isFeatured: prod.isFeatured,
        status: 'ACTIVE',
        shortDescription: prod.shortDescription,
        tags: {
          create: (prod.tags || []).map((tag) => ({ tag })),
        },
      },
    });
  }
  console.log(`   ✓ ${productsSeedData.length} products seeded`);

  // --- Settings ---
  console.log('⚙️  Seeding settings...');
  const existingSettings = await prisma.appSetting.findFirst();
  if (!existingSettings) {
    await prisma.appSetting.create({ data: settingsSeedData as any });
  }
  console.log('   ✓ Settings seeded');

  // --- Locations ---
  console.log('📍 Seeding locations...');
  const { divisions, districts, upazilas } = locationsSeedData;

  const divisionMap: Record<string, string> = {};
  for (const div of divisions) {
    const created = await prisma.division.upsert({
      where: { name: div.name },
      update: {},
      create: { name: div.name, nameBn: div.nameBn },
    });
    divisionMap[div.name] = created.id;
  }

  const districtMap: Record<string, string> = {};
  for (const dist of districts) {
    const divisionId = divisionMap[dist.division];
    if (!divisionId) continue;
    const created = await prisma.district.upsert({
      where: { divisionId_name: { divisionId, name: dist.name } },
      update: {},
      create: { divisionId, name: dist.name, nameBn: dist.nameBn },
    });
    districtMap[dist.name] = created.id;
  }

  for (const upa of upazilas) {
    const districtId = districtMap[upa.district];
    if (!districtId) continue;
    await prisma.upazila.upsert({
      where: { districtId_name: { districtId, name: upa.name } },
      update: {},
      create: { districtId, name: upa.name, nameBn: upa.nameBn },
    });
  }
  console.log(`   ✓ ${divisions.length} divisions, ${districts.length} districts, ${upazilas.length} upazilas seeded`);

  console.log('\n✅ Database seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
