import { ShieldCheck, Stethoscope, Lock, Truck } from 'lucide-react';

const badges = [
  { icon: ShieldCheck, title: 'Genuine Medicines', desc: '100% authentic products' },
  { icon: Stethoscope, title: 'Verified Pharmacist', desc: 'Expert prescription review' },
  { icon: Lock, title: 'Secure Payment', desc: 'bKash, Nagad, Rocket, COD' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Across Bangladesh' },
];

export function TrustBadges() {
  return (
    <section className="py-8 bg-muted/50">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div key={badge.title} className="flex flex-col items-center text-center p-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                <badge.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{badge.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
