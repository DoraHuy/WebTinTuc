'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HeroSection } from '@/components/homepage/HeroSection';
import { CategoryNav } from '@/components/homepage/CategoryNav';
import { PostGrid } from '@/components/homepage/PostGrid';
import { Sidebar } from '@/components/homepage/Sidebar';
import { PostFilter } from '@/components/homepage/PostFilter';
import { PostPagination } from '@/components/homepage/PostPagination';
import { SearchBar } from '@/components/homepage/SearchBar';
import { ChatboxAI } from '@/components/ChatboxAI';
import { FilterOptions, PaginationInfo, Post, Category, TopAuthor, TrendingPost } from '@/types/Homepage';
import CartIcon from '@/components/CartIcon';
import { ModeToggle } from '@/components/ModeToggle';
import { Wallet, ShoppingBag, User, FileEdit, List, Shield, ChevronDown, BookMarked, MessageSquare, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined;

  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'latest',
    category: categoryId,
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

  // Load posts when category changes from URL
  useEffect(() => {
    if (categoryId !== undefined) {
      handleFilterChange({ ...filters, category: categoryId });
    }
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-background text-foreground/90">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-linear-to-r from-background/80 via-primary/10 to-secondary/10 backdrop-blur-2xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.65)]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-primary via-accent to-secondary shadow-[0_10px_30px_-15px_rgba(0,0,0,0.65)] ring-1 ring-white/20 flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold leading-tight">TechNews</h1>
                  <p className="text-xs text-muted-foreground">Tin tức công nghệ hàng đầu</p>
                </div>
              </Link>
            </div>
            
            {/* Search Bar in Header */}
            <div className="hidden md:block flex-1 max-w-xl">
              <SearchBar />
            </div>

            <nav className="hidden md:flex items-center gap-3 shrink-0">
              <Link href="/" className="text-sm font-semibold px-3 py-2 rounded-full bg-white/0 border border-white/0 hover:bg-white/10 hover:border-white/10 transition-all">
                Trang chủ
              </Link>
              <Link href="/purchased" className="text-sm font-semibold px-3 py-2 rounded-full bg-white/0 border border-white/0 hover:bg-white/10 hover:border-white/10 transition-all flex items-center gap-1">
                <ShoppingBag className="w-4 h-4" />
                Đã mua
              </Link>
              <Link href="/wallet" className="text-sm font-semibold px-3 py-2 rounded-full bg-white/0 border border-white/0 hover:bg-white/10 hover:border-white/10 transition-all flex items-center gap-1">
                <Wallet className="w-4 h-4" />
                Ví
              </Link>
              <Link href="/posts/submit" className="text-sm font-semibold px-3 py-2 rounded-full bg-white/0 border border-white/0 hover:bg-white/10 hover:border-white/10 transition-all flex items-center gap-1">
                <FileEdit className="w-4 h-4" />
                Đăng bài
              </Link>
              <Link href="/my-submissions" className="text-sm font-semibold px-3 py-2 rounded-full bg-white/0 border border-white/0 hover:bg-white/10 hover:border-white/10 transition-all flex items-center gap-1">
                <List className="w-4 h-4" />
                Bài đã gửi
              </Link>
              <Link href="/manage" className="text-sm font-semibold px-3 py-2 rounded-full bg-white/0 border border-white/0 hover:bg-white/10 hover:border-white/10 transition-all flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Quản lý
              </Link>
              {session && <CartIcon userId={session.userId} />}
              <ModeToggle />
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/15 hover:bg-white/15 transition-all">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm ring-2 ring-white/20">
                        {session.tenNguoiDung.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-semibold">{session.tenNguoiDung}</span>
                        <span className="text-xs text-muted-foreground">{session.email}</span>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/my-posts/approved" className="flex items-center gap-2 cursor-pointer">
                        <FileEdit className="w-4 h-4" />
                        Bài viết của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-submissions" className="flex items-center gap-2 cursor-pointer">
                        <List className="w-4 h-4" />
                        Bài đã gửi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/saved-posts" className="flex items-center gap-2 cursor-pointer">
                        <BookMarked className="w-4 h-4" />
                        Bài viết đã lưu
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-comments" className="flex items-center gap-2 cursor-pointer">
                        <MessageSquare className="w-4 h-4" />
                        Bình luận của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wallet" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="w-4 h-4" />
                        Ví của tôi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/purchased" className="flex items-center gap-2 cursor-pointer">
                        <ShoppingBag className="w-4 h-4" />
                        Đã mua
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/manage" className="flex items-center gap-2 cursor-pointer">
                        <Shield className="w-4 h-4" />
                        Quản lý (Admin)
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <button
                        onClick={async () => {
                          await fetch('/api/auth/logout', { method: 'POST' });
                          window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-2 text-destructive cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-primary via-secondary to-accent text-primary-foreground font-semibold text-sm shadow-[0_12px_40px_-20px_rgba(0,0,0,0.7)] hover:scale-[1.02] transition-all"
                  >
                    <User className="w-4 h-4" />
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/50 text-primary font-semibold text-sm bg-white/5 hover:bg-white/10 hover:text-primary-foreground hover:border-white/30 transition-all"
                  >
                    <User className="w-4 h-4" />
                    Đăng ký
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {/* Hero Section */}
        <HeroSection featuredPost={featuredPost} latestPosts={latestPosts} />

        {/* Search Bar for Mobile */}
        <div className="md:hidden max-w-2xl mx-auto my-8">
          <SearchBar />
        </div>

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
      <footer className="mt-16 border-t border-white/10 bg-linear-to-b from-background/80 via-background/60 to-background/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h3 className="font-bold text-xl">TechNews</h3>
              <p className="text-sm text-muted-foreground">
                Nền tảng tin tức công nghệ hàng đầu Việt Nam
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-primary">Danh mục</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary">Công nghệ</Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-primary">AI</Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-primary">Smartphone</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-primary">Về chúng tôi</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/features" className="hover:text-primary">Giới thiệu</Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-primary">Liên hệ</Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-primary">Điều khoản</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-primary">Theo dõi</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Facebook</a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Twitter</a>
                </li>
                <li>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">YouTube</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-muted-foreground">
            © 2025 TechNews. All rights reserved.
          </div>
        </div>
      </footer>

      {/* AI Chatbox - Chỉ hiện khi đã đăng nhập */}
      {session && <ChatboxAI />}
    </div>
  );
}
