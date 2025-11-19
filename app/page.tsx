"use client"

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { NewsCard } from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { usePosts } from "./CustomHook/UsePosts";
import { TrendingUp, Clock, Flame } from "lucide-react";

export default function Home() {
  const { posts, isLoading, error } = usePosts();

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <p className="text-destructive">Không thể tải tin tức. Vui lòng thử lại sau.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b">
          <div className="container py-12 md:py-20">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Tin Tức 24h
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Cập nhật tin tức mới nhất, nhanh nhất và chính xác nhất mỗi ngày
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Tin nổi bật
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Tin mới nhất
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured News Section */}
        <section className="container py-8 md:py-12">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Tin Nóng Hôm Nay</h2>
          </div>
          
          {posts && posts.length > 0 ? (
            <>
              {/* Main Featured Article */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <NewsCard {...posts[0]} />
                {posts[1] && <NewsCard {...posts[1]} />}
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(2).map((post: any) => (
                  <NewsCard key={post.id} {...post} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có tin tức nào</p>
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section className="bg-muted/50 py-8 md:py-12 border-y">
          <div className="container">
            <h2 className="text-2xl font-bold mb-6">Danh Mục Tin Tức</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {["Thời sự", "Kinh tế", "Giải trí", "Thể thao", "Công nghệ", "Giáo dục"].map((category) => (
                <Button key={category} variant="outline" className="h-auto py-4">
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
