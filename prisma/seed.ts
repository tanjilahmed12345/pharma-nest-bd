import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcryptjs from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcryptjs.hash('Admin@2026', 12);
  await prisma.user.upsert({
    where: { email: 'admin@pharmanestbd.com' },
    update: {},
    create: {
      email: 'admin@pharmanestbd.com',
      password: adminPassword,
      name: 'Pharmacy Admin',
      phone: '01963812345',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('  Admin: admin@pharmanestbd.com / Admin@2026');

  // Create test customers
  const rahimPassword = await bcryptjs.hash('Rahim@2026', 12);
  await prisma.user.upsert({
    where: { email: 'rahim@gmail.com' },
    update: {},
    create: {
      email: 'rahim@gmail.com',
      password: rahimPassword,
      name: 'Rahim Uddin',
      phone: '01812345678',
      role: 'customer',
      isActive: true,
    },
  });
  console.log('  Customer: rahim@gmail.com / Rahim@2026');

  const fatemaPassword = await bcryptjs.hash('Fatema@2026', 12);
  await prisma.user.upsert({
    where: { email: 'fatema@gmail.com' },
    update: {},
    create: {
      email: 'fatema@gmail.com',
      password: fatemaPassword,
      name: 'Fatema Akter',
      phone: '01987654321',
      role: 'customer',
      isActive: true,
    },
  });
  console.log('  Customer: fatema@gmail.com / Fatema@2026');

  // Create default store settings
  const existingSettings = await prisma.storeSetting.findFirst();
  if (!existingSettings) {
    await prisma.storeSetting.create({
      data: {
        storeName: 'PharmaNest BD',
        storeEmail: 'care@pharmanestbd.com',
        storePhone: '09638123456',
        storeAddress: 'House 42, Road 27, Dhanmondi, Dhaka-1209',
        deliveryCharge: 60,
        freeDeliveryThreshold: 500,
        currency: 'BDT',
        currencySymbol: '৳',
      },
    });
    console.log('  Store settings created');
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
