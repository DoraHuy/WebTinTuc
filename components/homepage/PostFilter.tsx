'use client';

import { FilterOptions } from '@/types/Homepage';
import { Filter, SlidersHorizontal, Crown, X } from 'lucide-react';
import { useState } from 'react';

interface PostFilterProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function PostFilter({ filters, onFilterChange }: PostFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const sortOptions = [
    { value: 'latest', label: 'Mới nhất' },
    { value: 'trending', label: 'Thịnh hành' },
    { value: 'popular', label: 'Phổ biến' },
  ];

  const hasActiveFilters = filters.isPremium !== undefined || filters.sortBy !== 'latest';

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Sắp xếp:</label>
          <select
            value={filters.sortBy || 'latest'}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                sortBy: e.target.value as FilterOptions['sortBy'],
              })
            }
            className="px-4 py-2 rounded-xl border border-white/15 bg-white/5 backdrop-blur text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/60 shadow-inner shadow-white/5"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold transition-all shadow-[0_12px_40px_-26px_rgba(0,0,0,0.9)] ${
            hasActiveFilters
              ? 'bg-linear-to-r from-primary to-secondary text-primary-foreground border-white/20'
              : 'bg-white/5 hover:bg-white/10 text-foreground/90 border-white/10'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Bộ lọc
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_0_4px_rgba(255,255,255,0.12)]"></span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-4 shadow-[0_24px_70px_-60px_rgba(0,0,0,0.95)]">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Bộ lọc nâng cao
            </h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Premium Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Loại bài viết</label>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    isPremium: undefined,
                  })
                }
                className={`flex-1 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                  filters.isPremium === undefined
                    ? 'bg-linear-to-r from-primary to-secondary text-primary-foreground border-white/20 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.9)]'
                    : 'bg-white/5 hover:bg-white/10 text-foreground/90 border-white/10'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    isPremium: false,
                  })
                }
                className={`flex-1 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                  filters.isPremium === false
                    ? 'bg-linear-to-r from-primary to-secondary text-primary-foreground border-white/20 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.9)]'
                    : 'bg-white/5 hover:bg-white/10 text-foreground/90 border-white/10'
                }`}
              >
                Miễn phí
              </button>
              <button
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    isPremium: true,
                  })
                }
                className={`flex-1 px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                  filters.isPremium === true
                    ? 'bg-linear-to-r from-amber-400 to-amber-500 text-white border-white/20 shadow-[0_12px_40px_-26px_rgba(0,0,0,0.9)]'
                    : 'bg-white/5 hover:bg-white/10 text-foreground/90 border-white/10'
                }`}
              >
                <Crown className="w-4 h-4 inline mr-1" />
                Premium
              </button>
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={() =>
                onFilterChange({
                  sortBy: 'latest',
                })
              }
              className="w-full px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm font-semibold transition-all"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      )}
    </div>
  );
}
