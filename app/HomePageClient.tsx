'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/homepage/HeroSection';
import { CategoryNav } from '@/components/homepage/CategoryNav';
import { PostGrid } from '@/components/homepage/PostGrid';
import { Sidebar } from '@/components/homepage/Sidebar';
import { PostFilter } from '@/components/homepage/PostFilter';
import { PostPagination } from '@/components/homepage/PostPagination';
import { FilterOptions, PaginationInfo, Post, Category, TopAuthor, TrendingPost } from '@/lib/types/Homepage';
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
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'latest',
  });

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const itemsPerPage = 10;
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: Math.ceil(totalPosts / itemsPerPage),
    totalItems: totalPosts,
    itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * itemsPerPage;
    const newPosts = getPosts({
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

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    
    const filteredTotal = getTotalPosts({
      categoryId: newFilters.category,
      isPremium: newFilters.isPremium,
    });
    
    const newPosts = getPosts({
      limit: itemsPerPage,
      offset: 0,
      categoryId: newFilters.category,
      isPremium: newFilters.isPremium,
      sortBy: newFilters.sortBy,
    });
    
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
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold">TechNews</h1>
                <p className="text-xs text-muted-foreground">Tin tức công nghệ hàng đầu</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Trang chủ
              </a>
              <a href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                Giới thiệu
              </a>
              <a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                Liên hệ
              </a>
              <button className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all">
                Nâng cấp Premium
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection featuredPost={featuredPost} latestPosts={latestPosts} />

        {/* Category Navigation */}
        <CategoryNav categories={categories} activeCategory={filters.category} />

        {/* Content Grid with Sidebar */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <div>
            {/* Filters */}
            <PostFilter filters={filters} onFilterChange={handleFilterChange} />

            {/* Posts Grid */}
            <PostGrid posts={posts} />

            {/* Pagination */}
            <PostPagination pagination={pagination} onPageChange={handlePageChange} />
          </div>

          {/* Sidebar */}
          <Sidebar
            topAuthors={topAuthors}
            topInteractions={topInteractions}
            topRevenue={topRevenue}
            trendingPosts={trendingPosts}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">TechNews</h3>
              <p className="text-sm text-muted-foreground">
                Nền tảng tin tức công nghệ hàng đầu Việt Nam
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Danh mục</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Công nghệ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    AI
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Smartphone
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Giới thiệu
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Liên hệ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Điều khoản
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Theo dõi</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 TechNews. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
