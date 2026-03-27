"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const users_seed_1 = require("./seed-data/users.seed");
const categories_seed_1 = require("./seed-data/categories.seed");
const brands_seed_1 = require("./seed-data/brands.seed");
const products_seed_1 = require("./seed-data/products.seed");
const settings_seed_1 = require("./seed-data/settings.seed");
const locations_seed_1 = require("./seed-data/locations.seed");
const prisma = new client_1.PrismaClient();
const SALT_ROUNDS = 10;
async function main() {
    console.log('🌱 Starting database seed...\n');
    console.log('👤 Seeding users...');
    for (const user of users_seed_1.usersSeedData) {
        const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                phone: user.phone,
                fullName: user.fullName,
                role: user.role,
                passwordHash: hash,
                status: 'ACTIVE',
            },
        });
    }
    console.log(`   ✓ ${users_seed_1.usersSeedData.length} users seeded`);
    console.log('📁 Seeding categories...');
    const categoryMap = {};
    for (const cat of categories_seed_1.categoriesSeedData) {
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
    console.log(`   ✓ ${categories_seed_1.categoriesSeedData.length} categories seeded`);
    console.log('🏷️  Seeding brands...');
    const brandMap = {};
    for (const brand of brands_seed_1.brandsSeedData) {
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
    console.log(`   ✓ ${brands_seed_1.brandsSeedData.length} brands seeded`);
    console.log('💊 Seeding products...');
    for (const prod of products_seed_1.productsSeedData) {
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
                dosageForm: prod.dosageForm,
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
    console.log(`   ✓ ${products_seed_1.productsSeedData.length} products seeded`);
    console.log('⚙️  Seeding settings...');
    const existingSettings = await prisma.appSetting.findFirst();
    if (!existingSettings) {
        await prisma.appSetting.create({ data: settings_seed_1.settingsSeedData });
    }
    console.log('   ✓ Settings seeded');
    console.log('📍 Seeding locations...');
    const { divisions, districts, upazilas } = locations_seed_1.locationsSeedData;
    const divisionMap = {};
    for (const div of divisions) {
        const created = await prisma.division.upsert({
            where: { name: div.name },
            update: {},
            create: { name: div.name, nameBn: div.nameBn },
        });
        divisionMap[div.name] = created.id;
    }
    const districtMap = {};
    for (const dist of districts) {
        const divisionId = divisionMap[dist.division];
        if (!divisionId)
            continue;
        const created = await prisma.district.upsert({
            where: { divisionId_name: { divisionId, name: dist.name } },
            update: {},
            create: { divisionId, name: dist.name, nameBn: dist.nameBn },
        });
        districtMap[dist.name] = created.id;
    }
    for (const upa of upazilas) {
        const districtId = districtMap[upa.district];
        if (!districtId)
            continue;
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
//# sourceMappingURL=seed.js.map