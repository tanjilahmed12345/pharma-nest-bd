import { Phone, Mail } from 'lucide-react';

export function Topbar() {
  return (
    <div className="hidden md:block bg-primary-dark text-white text-xs">
      <div className="container-custom flex items-center justify-between py-1.5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" /> 01700-000000
          </span>
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3" /> support@pharmanest.com.bd
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>Genuine Medicines | Licensed Pharmacy</span>
        </div>
      </div>
    </div>
  );
}
