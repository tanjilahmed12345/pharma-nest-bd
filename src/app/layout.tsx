import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SeedInitializer } from '@/components/common/SeedInitializer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PharmaNest BD - Your Trusted Online Pharmacy',
  description:
    'Order genuine medicines online in Bangladesh. Fast delivery, verified pharmacist, secure payment with bKash, Nagad, Rocket.',
  keywords: ['pharmacy', 'medicine', 'Bangladesh', 'online pharmacy', 'health'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <SeedInitializer />
        {children}
      </body>
    </html>
  );
}
