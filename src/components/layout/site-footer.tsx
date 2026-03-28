import Link from 'next/link';
import { Pill, Phone, Mail, MapPin, Globe, Send } from 'lucide-react';

const shopLinks = [
  { href: '/shop', label: 'All Medicines' },
  { href: '/otc', label: 'OTC Medicines' },
  { href: '/rx', label: 'Prescription Medicines' },
  { href: '/offers', label: 'Offers & Deals' },
  { href: '/upload-prescription', label: 'Upload Prescription' },
];

const supportLinks = [
  { href: '/account', label: 'My Account' },
  { href: '/account/orders', label: 'My Orders' },
  { href: '/track-order', label: 'Track Order' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact Us' },
];

const companyLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/terms', label: 'Terms & Conditions' },
  { href: '/privacy', label: 'Privacy Policy' },
];

export function SiteFooter() {
  return (
    <footer className="bg-footer-bg text-footer-text mt-auto">
      {/* Main footer */}
      <div className="container-custom pt-10 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
                <Pill className="h-5 w-5 text-primary-light" />
              </div>
              <span className="text-xl font-bold text-white">
                Pharma<span className="text-secondary">Nest</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed opacity-70 max-w-xs mb-5">
              Your trusted online pharmacy in Bangladesh. Genuine medicines, verified by licensed pharmacists, delivered to your doorstep.
            </p>
            <div className="space-y-2.5">
              <a href="tel:09638123456" className="flex items-center gap-2.5 text-sm opacity-75 hover:opacity-100 transition-opacity">
                <Phone className="h-4 w-4 text-primary-light shrink-0" />
                09638-123456
              </a>
              <a href="mailto:care@pharmanestbd.com" className="flex items-center gap-2.5 text-sm opacity-75 hover:opacity-100 transition-opacity">
                <Mail className="h-4 w-4 text-primary-light shrink-0" />
                care@pharmanestbd.com
              </a>
              <p className="flex items-center gap-2.5 text-sm opacity-75">
                <MapPin className="h-4 w-4 text-primary-light shrink-0" />
                House 42, Road 27, Dhanmondi, Dhaka-1209
              </p>
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm opacity-65 hover:opacity-100 hover:text-white transition-all">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm opacity-65 hover:opacity-100 hover:text-white transition-all">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company + Payment */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5 mb-6">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm opacity-65 hover:opacity-100 hover:text-white transition-all">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Payment badges */}
            <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">We Accept</h4>
            <div className="flex flex-wrap gap-2">
              {['bKash', 'Nagad', 'Rocket', 'COD'].map((method) => (
                <span
                  key={method}
                  className="px-2.5 py-1 bg-white/8 border border-white/10 rounded text-xs font-medium text-white/80"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs opacity-45">
            &copy; {new Date().getFullYear()} PharmaNest BD. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Website" className="h-8 w-8 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors">
              <Globe className="h-3.5 w-3.5 text-white/70" />
            </a>
            <a href="#" aria-label="Telegram" className="h-8 w-8 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/15 transition-colors">
              <Send className="h-3.5 w-3.5 text-white/70" />
            </a>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-white/5">
        <div className="container-custom py-3">
          <p className="text-[10px] opacity-35 text-center leading-relaxed">
            Disclaimer: This website is for informational purposes only and does not constitute medical advice. Always consult a healthcare professional before taking any medicine.
          </p>
        </div>
      </div>
    </footer>
  );
}
