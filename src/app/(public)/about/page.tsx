import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Stethoscope, Truck, Award } from 'lucide-react';

export const metadata = { title: 'About Us | PharmaNest BD' };

const values = [
  { icon: ShieldCheck, title: 'Genuine Medicines', desc: 'We source all products directly from licensed manufacturers and distributors.' },
  { icon: Stethoscope, title: 'Pharmacist Verified', desc: 'Every prescription is reviewed by our licensed pharmacists before dispatch.' },
  { icon: Truck, title: 'Reliable Delivery', desc: 'Fast and safe delivery across all 64 districts of Bangladesh.' },
  { icon: Award, title: 'Quality Assurance', desc: 'We maintain strict quality control and proper storage conditions.' },
];

export default function AboutPage() {
  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} className="mb-6" />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">About PharmaNest BD</h1>
        <p className="text-muted-foreground leading-relaxed mb-6">
          PharmaNest BD is Bangladesh&apos;s trusted online pharmacy platform. We make healthcare accessible by delivering genuine medicines and health products right to your doorstep. Our mission is to provide safe, affordable, and convenient access to essential medicines for every Bangladeshi citizen.
        </p>

        <h2 className="text-xl font-bold mb-4">Our Values</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {values.map((v) => (
            <Card key={v.title} padding="md">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{v.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{v.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-3">Contact Information</h2>
        <Card padding="md">
          <div className="space-y-2 text-sm">
            <p><strong>Address:</strong> House 42, Road 27, Dhanmondi, Dhaka-1209</p>
            <p><strong>Phone:</strong> 09638-123456</p>
            <p><strong>Email:</strong> care@pharmanestbd.com</p>
            <p><strong>Hours:</strong> Saturday - Thursday, 9:00 AM - 10:00 PM</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
