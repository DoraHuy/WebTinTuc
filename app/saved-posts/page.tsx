'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bookmark, ChevronLeft, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface SavedPost {
  id: number;
  maTinTuc: number;
  ngayLuu: string;
  tinTuc: {
    id: number;
    tenTinTuc: string;
    tomTat?: string;
    thumbnail?: string;
    ngayDang: string;
    isPremium: boolean;
    nguoiDung: {
      tenNguoiDung: string;
    };
  };
}

export default function SavedPostsPage() {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedPosts = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          window.location.href = '/login?redirect=/saved-posts';
          return;
        }
        const userData = await authRes.json();
        const userId = userData?.user?.userId;
        if (!userId) return;

        const res = await fetch(`/api/bookmarks?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setSavedPosts(data.bookmarks || []);
        }
      } catch (error) {
        console.error('Error loading saved posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSavedPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-5 h-5" />
            <span>Quay lại trang chủ</span>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Bookmark className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Bài viết đã lưu</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Bạn đã lưu {savedPosts.length} bài viết
          </p>
        </div>

        {savedPosts.length === 0 ? (
          <div className="text-center py-16">
            <Bookmark className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Chưa có bài viết nào</h2>
            <p className="text-muted-foreground mb-6">
              Lưu những bài viết yêu thích để đọc lại sau
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Khám phá bài viết
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((item) => {
              const post = item.tinTuc;
              const seed = typeof post.id === 'number' ? post.id : post.tenTinTuc.length;
              const fallbackImage = `https://picsum.photos/seed/${seed}/400/300`;
              const imageUrl = post.thumbnail && post.thumbnail.trim() !== '' ? post.thumbnail : fallbackImage;
              const savedDate = formatDistanceToNow(new Date(item.ngayLuu), {
                addSuffix: true,
                locale: vi,
              });

              return (
                <Link
                  key={item.id}
                  href={`/posts/${post.id}`}
                  className="block border-2 border-white/10 rounded-xl overflow-hidden bg-white/5 hover:border-primary/40 hover:shadow-lg transition-all"
                >
                  <div className="flex gap-4 p-4">
                    <div className="w-48 h-32 shrink-0 rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={post.tenTinTuc}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {post.tenTinTuc}
                      </h3>
                      {post.tomTat && (
                        <p className="text-muted-foreground line-clamp-2 mb-3">
                          {post.tomTat}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{post.nguoiDung.tenNguoiDung}</span>
                        <span>•</span>
                        <span>Đã lưu {savedDate}</span>
                        {post.isPremium && (
                          <>
                            <span>•</span>
                            <span className="text-yellow-600 font-semibold">Premium</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
