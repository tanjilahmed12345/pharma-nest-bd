import Link from 'next/link';
import { Logo } from '@/components/common/logo';
import { Phone, Mail, MapPin } from 'lucide-react';

const quickLinks = [
  { href: '/shop', label: 'Shop All' },
  { href: '/otc', label: 'OTC Medicines' },
  { href: '/rx', label: 'Prescription Medicines' },
  { href: '/upload-prescription', label: 'Upload Prescription' },
  { href: '/offers', label: 'Offers' },
];

const accountLinks = [
  { href: '/login', label: 'Login' },
  { href: '/register', label: 'Register' },
  { href: '/account/orders', label: 'Track Order' },
  { href: '/account', label: 'My Account' },
];

const policyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="lg" className="mb-4 [&_span]:text-white [&_svg]:text-primary-light" />
            <p className="text-sm text-gray-400 mb-4">
              Your trusted online pharmacy in Bangladesh. Genuine medicines delivered to your door.
            </p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> 01700-000000</p>
              <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> support@pharmanest.com.bd</p>
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Dhanmondi, Dhaka-1205</p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Account</h4>
            <ul className="space-y-2">
              {accountLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Information</h4>
            <ul className="space-y-2">
              {policyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">We accept: bKash, Nagad, Rocket, Cash on Delivery</p>
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} PharmaNest BD. All rights reserved.
            </p>
          </div>
          <p className="text-[10px] text-gray-600 mt-3 text-center">
            Disclaimer: This website is for informational purposes only and does not constitute medical advice. Always consult a healthcare professional before taking any medicine.
          </p>
        </div>
      </div>
    </footer>
  );
}
