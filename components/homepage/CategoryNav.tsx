import { Category } from '@/lib/types/Homepage';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: number;
}

export function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  return (
    <nav className="mb-8 overflow-x-auto">
      <div className="flex gap-2 pb-2 min-w-max">
        <Link
          href="/"
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            !activeCategory
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          Tất cả
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/?category=${cat.id}`}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {cat.tenDanhMuc}
          </Link>
        ))}
      </div>
    </nav>
  );
}
