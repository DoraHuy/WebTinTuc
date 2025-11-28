'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeroSection } from '@/components/homepage/HeroSection';
import { CategoryNav } from '@/components/homepage/CategoryNav';
import { PostGrid } from '@/components/homepage/PostGrid';
import { Sidebar } from '@/components/homepage/Sidebar';
import { PostFilter } from '@/components/homepage/PostFilter';
import { PostPagination } from '@/components/homepage/PostPagination';
import { ChatboxAI } from '@/components/ChatboxAI';
import { FilterOptions, PaginationInfo, Post, Category, TopAuthor, TrendingPost } from '@/lib/types/Homepage';
import CartIcon from '@/components/CartIcon';
import { ModeToggle } from '@/components/ModeToggle';
import { Wallet, ShoppingBag, User, FileEdit, List, Shield } from 'lucide-react';

interface HomePageClientProps {
  featuredPost: Post | null;
  latestPosts: Post[];
  initialPosts: Post[];
  categories: Category[];
  topAuthors: TopAuthor[];
  topInteractions: TopAuthor[];
  topRevenue: TopAuthor[];
  trendingPosts: TrendingPost[];
  totalPosts: number;
  session: { userId: number; tenNguoiDung: string; email: string } | null;
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
  session,
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

  const handlePageChange = async (page: number) => {
    const offset = (page - 1) * itemsPerPage;
    
    try {
      const response = await fetch(`/api/posts?limit=${itemsPerPage}&offset=${offset}&categoryId=${filters.category || ''}&isPremium=${filters.isPremium !== undefined ? filters.isPremium : ''}&sortBy=${filters.sortBy || 'latest'}`);
      const data = await response.json();
      
      if (data.posts) {
        setPosts(data.posts);
        setPagination({ ...pagination, currentPage: page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleFilterChange = async (newFilters: FilterOptions) => {
    setFilters(newFilters);
    
    try {
      const countResponse = await fetch(`/api/posts/count?categoryId=${newFilters.category || ''}&isPremium=${newFilters.isPremium !== undefined ? newFilters.isPremium : ''}`);
      const countData = await countResponse.json();
      
      const postsResponse = await fetch(`/api/posts?limit=${itemsPerPage}&offset=0&categoryId=${newFilters.category || ''}&isPremium=${newFilters.isPremium !== undefined ? newFilters.isPremium : ''}&sortBy=${newFilters.sortBy || 'latest'}`);
      const postsData = await postsResponse.json();
      
      if (postsData.posts) {
        setPosts(postsData.posts);
        setPagination({
          currentPage: 1,
          totalPages: Math.ceil(countData.count / itemsPerPage),
          totalItems: countData.count,
          itemsPerPage,
        });
      }
    } catch (error) {
      console.error('Error filtering posts:', error);
    }
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
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <Link href="/purchased" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <ShoppingBag className="w-4 h-4" />
                Đã mua
              </Link>
              <Link href="/wallet" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <Wallet className="w-4 h-4" />
                Ví
              </Link>
              <Link href="/posts/submit" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <FileEdit className="w-4 h-4" />
                Đăng bài
              </Link>
              <Link href="/my-submissions" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <List className="w-4 h-4" />
                Bài đã gửi
              </Link>
              <Link href="/manage" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Quản lý
              </Link>
              
              {/* Cart Icon */}
              <CartIcon userId={1} />
              
              {/* Theme Toggle */}
              <ModeToggle />
              
              {/* Login/Profile */}
              {session ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {session.tenNguoiDung.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{session.tenNguoiDung}</span>
                      <span className="text-xs text-muted-foreground">{session.email}</span>
                    </div>
                  </div>
                  <form action="/api/auth/logout" method="POST">
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium text-sm hover:bg-destructive/90 transition-all"
                    >
                      Đăng xuất
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:shadow-lg transition-all">
                    <User className="w-4 h-4" />
                    Đăng nhập
                  </Link>
                  <Link href="/register" className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all">
                    Đăng ký
                  </Link>
                </div>
              )}
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
                  <Link href="/" className="hover:text-primary">
                    Công nghệ
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-primary">
                    AI
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-primary">
                    Smartphone
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-primary">
                    Giới thiệu
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-primary">
                    Liên hệ
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-primary">
                    Điều khoản
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Theo dõi</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2025 TechNews. All rights reserved.
          </div>
        </div>
      </footer>

      {/* AI Chatbox - Chỉ hiện khi đã đăng nhập */}
      {session && <ChatboxAI />}
    </div>
  );
}
