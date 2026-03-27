import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark text-white py-16 md:py-24">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Your Trusted Online Pharmacy in Bangladesh
          </h1>
          <p className="text-lg md:text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Order genuine medicines online. Fast delivery across Bangladesh with verified pharmacist support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/upload-prescription"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Upload Prescription
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { title: 'Genuine Medicines', desc: '100% authentic products' },
              { title: 'Verified Pharmacist', desc: 'Expert prescription review' },
              { title: 'Secure Payment', desc: 'bKash, Nagad, Rocket, COD' },
              { title: 'Fast Delivery', desc: 'Across Bangladesh' },
            ].map((badge) => (
              <div key={badge.title} className="p-4">
                <h3 className="font-semibold text-primary text-sm md:text-base">{badge.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placeholder */}
      <section className="py-12">
        <div className="container-custom text-center text-muted-foreground">
          <p>Full homepage will be built in Phase 4. App foundation (Phase 1) is ready.</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Link href="/shop" className="text-primary underline">Shop</Link>
            <Link href="/login" className="text-primary underline">Login</Link>
            <Link href="/register" className="text-primary underline">Register</Link>
            <Link href="/cart" className="text-primary underline">Cart</Link>
            <Link href="/admin/dashboard" className="text-primary underline">Admin</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
