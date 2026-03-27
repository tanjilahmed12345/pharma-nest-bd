import Link from 'next/link';
import { Category } from '@/types';
import { SectionHeader } from '@/components/ui/section-header';
import { Pill } from 'lucide-react';

export interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="pt-8 pb-4">
      <div className="container-custom">
        <SectionHeader title="Shop by Category" subtitle="Browse our medicine categories" viewAllHref="/shop" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="group flex flex-col items-center text-center p-3 md:p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="h-12 w-12 bg-primary/5 rounded-full flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                <Pill className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs md:text-sm font-medium text-foreground line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
