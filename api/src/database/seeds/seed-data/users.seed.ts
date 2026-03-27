export const usersSeedData = [
  {
    email: 'admin@pharmacy.com',
    phone: '01700000000',
    fullName: 'Admin User',
    role: 'ADMIN' as const,
    password: 'admin123',
  },
  {
    email: 'pharmacist@pharmacy.com',
    phone: '01700000001',
    fullName: 'Dr. Kamal Hossain',
    role: 'PHARMACIST' as const,
    password: 'pharma123',
  },
  {
    email: 'rahim@gmail.com',
    phone: '01712345678',
    fullName: 'Abdur Rahim',
    role: 'CUSTOMER' as const,
    password: '123456',
  },
  {
    email: 'fatema@gmail.com',
    phone: '01898765432',
    fullName: 'Fatema Begum',
    role: 'CUSTOMER' as const,
    password: '123456',
  },
];
