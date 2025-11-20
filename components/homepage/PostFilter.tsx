'use client';

import { FilterOptions } from '@/lib/types/Homepage';
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
            className="px-4 py-2 rounded-lg border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
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
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
            hasActiveFilters
              ? 'bg-primary text-primary-foreground'
              : 'bg-background hover:bg-muted'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Bộ lọc
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-white"></span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 p-4 rounded-lg border bg-card space-y-4">
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
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  filters.isPremium === undefined
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
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
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  filters.isPremium === false
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background hover:bg-muted'
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
                className={`flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  filters.isPremium === true
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
                    : 'bg-background hover:bg-muted'
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
              className="w-full px-4 py-2 rounded-lg border bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          )}
        </div>
      )}
    </div>
  );
}
