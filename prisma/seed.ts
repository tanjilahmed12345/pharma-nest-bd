import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcryptjs from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcryptjs.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@pharmacy.com' },
    update: {},
    create: {
      email: 'admin@pharmacy.com',
      password: adminPassword,
      name: 'Admin',
      phone: '01700000000',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('  Admin: admin@pharmacy.com / admin123');

  // Create test customers
  const customerPassword = await bcryptjs.hash('123456', 12);
  await prisma.user.upsert({
    where: { email: 'rahim@gmail.com' },
    update: {},
    create: {
      email: 'rahim@gmail.com',
      password: customerPassword,
      name: 'Rahim Uddin',
      phone: '01812345678',
      role: 'customer',
      isActive: true,
    },
  });
  console.log('  Customer: rahim@gmail.com / 123456');

  await prisma.user.upsert({
    where: { email: 'fatema@gmail.com' },
    update: {},
    create: {
      email: 'fatema@gmail.com',
      password: customerPassword,
      name: 'Fatema Akter',
      phone: '01987654321',
      role: 'customer',
      isActive: true,
    },
  });
  console.log('  Customer: fatema@gmail.com / 123456');

  // Create default store settings
  const existingSettings = await prisma.storeSetting.findFirst();
  if (!existingSettings) {
    await prisma.storeSetting.create({
      data: {
        storeName: 'PharmaNest BD',
        storeEmail: 'info@pharmanest.com.bd',
        storePhone: '01700000000',
        storeAddress: 'Dhaka, Bangladesh',
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
