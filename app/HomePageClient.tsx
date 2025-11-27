'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/homepage/HeroSection';
import { CategoryNav } from '@/components/homepage/CategoryNav';
import { PostGrid } from '@/components/homepage/PostGrid';
import { Sidebar } from '@/components/homepage/Sidebar';
import { PostFilter } from '@/components/homepage/PostFilter';
import { PostPagination } from '@/components/homepage/PostPagination';
import { FilterOptions, PaginationInfo, Post, Category, TopAuthor, TrendingPost } from '@/lib/types/Homepage';
// Import Server Actions
import { getPosts, getTotalPosts } from '@/lib/data/homepage-data';

interface HomePageClientProps {
  featuredPost: Post;
  latestPosts: Post[];
  initialPosts: Post[];
  categories: Category[];
  topAuthors: TopAuthor[];
  topInteractions: TopAuthor[];
  topRevenue: TopAuthor[];
  trendingPosts: TrendingPost[];
  totalPosts: number;
}

export default function HomePageClient({
  featuredPost,
  latestPosts,
  initialPosts,
  categories,
  topAuthors,
  topInteractions,
  topRevenue,
  trendingPosts,
  totalPosts,
}: HomePageClientProps) {
  const [filters, setFilters] = useState<FilterOptions>({ sortBy: 'latest' });
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const itemsPerPage = 10;

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: Math.ceil(totalPosts / itemsPerPage),
    totalItems: totalPosts,
    itemsPerPage,
  });

  // Xử lý chuyển trang (Gọi Server Action)
  const handlePageChange = async (page: number) => {
    const offset = (page - 1) * itemsPerPage;
    const newPosts = await getPosts({
      limit: itemsPerPage,
      offset,
      categoryId: filters.category,
      isPremium: filters.isPremium,
      sortBy: filters.sortBy,
    });

    setPosts(newPosts);
    setPagination({ ...pagination, currentPage: page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý bộ lọc (Gọi Server Action)
  const handleFilterChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters);

    const [filteredTotal, newPosts] = await Promise.all([
      getTotalPosts({ categoryId: newFilters.category, isPremium: newFilters.isPremium }),
      getPosts({
        limit: itemsPerPage,
        offset: 0,
        categoryId: newFilters.category,
        isPremium: newFilters.isPremium,
        sortBy: newFilters.sortBy,
      })
    ]);

    setPosts(newPosts);
    setPagination({
      currentPage: 1,
      totalPages: Math.ceil(filteredTotal / itemsPerPage),
      totalItems: filteredTotal,
      itemsPerPage,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center text-2xl">🚀</div>
            <h1 className="text-2xl font-bold">TechNews</h1>
          </div>
          {/* ... Menu ... */}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <HeroSection featuredPost={featuredPost} latestPosts={latestPosts} />
        <CategoryNav categories={categories} activeCategory={filters.category} />
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div>
            <PostFilter filters={filters} onFilterChange={handleFilterChange} />
            <PostGrid posts={posts} />
            <PostPagination pagination={pagination} onPageChange={handlePageChange} />
          </div>
          <Sidebar topAuthors={topAuthors} topInteractions={topInteractions} topRevenue={topRevenue} trendingPosts={trendingPosts} />
        </div>
      </main>

      <footer className="border-t bg-card mt-16 py-8 text-center text-sm text-muted-foreground">
        © 2024 TechNews. All rights reserved.
      </footer>
    </div>
  );
}