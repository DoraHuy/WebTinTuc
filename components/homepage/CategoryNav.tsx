import { Category } from '@/types/Homepage';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: number;
}

export function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  return (
    <nav className="mb-8 overflow-x-auto">
      <div className="flex gap-2 pb-2 min-w-max px-2 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
        <Link
          href="/"
          className={`px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap border ${
            !activeCategory
              ? 'bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-[0_12px_40px_-24px_rgba(0,0,0,0.85)] border-white/20'
              : 'bg-white/5 hover:bg-white/10 text-foreground/90 border-white/10'
          }`}
        >
          Tất cả
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/?category=${cat.id}`}
            className={`px-4 py-2 rounded-full font-semibold transition-all whitespace-nowrap border ${
              activeCategory === cat.id
                ? 'bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-[0_12px_40px_-24px_rgba(0,0,0,0.85)] border-white/20'
                : 'bg-white/5 hover:bg-white/10 text-foreground/90 border-white/10'
            }`}
          >
            {cat.tenDanhMuc}
          </Link>
        ))}
      </div>
    </nav>
  );
}
