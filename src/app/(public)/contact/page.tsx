import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const metadata = { title: 'Contact Us | PharmaNest BD' };

const contacts = [
  { icon: Phone, title: 'Phone', value: '09638-123456', desc: 'Sat - Thu, 9AM - 10PM' },
  { icon: Mail, title: 'Email', value: 'care@pharmanestbd.com', desc: 'We reply within 24 hours' },
  { icon: MapPin, title: 'Address', value: 'House 42, Road 27, Dhanmondi', desc: 'Dhaka-1209, Bangladesh' },
  { icon: Clock, title: 'Hours', value: 'Sat - Thu: 9AM - 10PM', desc: 'Friday: 2PM - 10PM' },
];

export default function ContactPage() {
  return (
    <div className="container-custom py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]} className="mb-6" />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-6">Have questions? We&apos;re here to help.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {contacts.map((c) => (
            <Card key={c.title} padding="md" hover>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{c.title}</h3>
                  <p className="text-sm font-medium mt-0.5">{c.value}</p>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
