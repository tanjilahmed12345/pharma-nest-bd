import { Breadcrumb } from '@/components/ui/breadcrumb';

export const metadata = { title: 'Privacy Policy | PharmaNest BD' };

export default function PrivacyPage() {
  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]} className="mb-6" />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-6">Last updated: March 2026</p>

        <div className="space-y-6 text-sm text-foreground leading-relaxed">
          <section><h2 className="text-lg font-bold mb-2">1. Information We Collect</h2><p>We collect personal information including name, email, phone number, delivery address, and prescription details when you create an account or place an order.</p></section>
          <section><h2 className="text-lg font-bold mb-2">2. How We Use Your Information</h2><p>Your information is used to process orders, verify prescriptions, communicate delivery updates, and improve our services. We never sell personal data to third parties.</p></section>
          <section><h2 className="text-lg font-bold mb-2">3. Prescription Data</h2><p>Prescription information is handled with strict confidentiality and only shared with our licensed pharmacists for verification purposes as required by Bangladesh pharmaceutical regulations.</p></section>
          <section><h2 className="text-lg font-bold mb-2">4. Payment Security</h2><p>Payment details for mobile wallet transactions (bKash, Nagad, Rocket) are processed securely. We store only transaction IDs and sender numbers for verification, not your wallet PINs.</p></section>
          <section><h2 className="text-lg font-bold mb-2">5. Data Storage</h2><p>Your data is stored securely and retained only as long as necessary to provide our services and comply with legal obligations.</p></section>
          <section><h2 className="text-lg font-bold mb-2">6. Your Rights</h2><p>You may request access to, correction of, or deletion of your personal data by contacting us at support@pharmanest.com.bd.</p></section>
          <section><h2 className="text-lg font-bold mb-2">7. Contact</h2><p>For privacy concerns, contact us at: support@pharmanest.com.bd or call 01700-000000.</p></section>
        </div>
      </div>
    </div>
  );
}
