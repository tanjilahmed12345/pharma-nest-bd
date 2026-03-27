import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata = { title: 'Terms & Conditions | PharmaNest BD' };

export default function TermsPage() {
  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Terms & Conditions' }]} className="mb-6" />
      <div className="max-w-3xl mx-auto prose prose-sm prose-slate">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
        <p className="text-muted-foreground mb-6">Last updated: March 2026</p>

        <div className="space-y-6 text-sm text-foreground leading-relaxed">
          <section><h2 className="text-lg font-bold mb-2">1. General</h2><p>By using PharmaNest BD, you agree to these terms. We reserve the right to update these terms at any time. Continued use constitutes acceptance.</p></section>
          <section><h2 className="text-lg font-bold mb-2">2. Products & Pricing</h2><p>All product information is for reference only. Prices are in BDT and may change without notice. Product images may vary from actual items.</p></section>
          <section><h2 className="text-lg font-bold mb-2">3. Prescription Medicines</h2><p>Prescription medicines require a valid prescription from a licensed physician. Our pharmacist reserves the right to reject prescriptions that are expired, illegible, or do not meet regulatory requirements.</p></section>
          <section><h2 className="text-lg font-bold mb-2">4. Orders & Payment</h2><p>Orders are subject to availability and pharmacist approval. We accept bKash, Nagad, Rocket, and Cash on Delivery. Payment verification is required for mobile wallet transactions.</p></section>
          <section><h2 className="text-lg font-bold mb-2">5. Delivery</h2><p>We aim to deliver within 1-5 business days depending on location. Delivery charges apply for orders below the free delivery threshold. We are not liable for delays caused by circumstances beyond our control.</p></section>
          <section><h2 className="text-lg font-bold mb-2">6. Returns & Refunds</h2><p>Due to pharmaceutical safety regulations, medicines cannot be returned once delivered. Damaged or incorrect items will be replaced at no additional cost upon verification.</p></section>
          <section><h2 className="text-lg font-bold mb-2">7. Limitation of Liability</h2><p>PharmaNest BD provides a platform for purchasing medicines and health products. We are not a substitute for professional medical advice. Always consult your healthcare provider.</p></section>
        </div>
      </div>
    </div>
  );
}
