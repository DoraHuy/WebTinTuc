'use client';

import { TrendingPost, TopPeriod } from '@/types/Homepage';
import { Flame } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface TrendingPostsProps {
  posts: TrendingPost[];
}

export function TrendingPosts({ posts }: TrendingPostsProps) {
  const [period, setPeriod] = useState<TopPeriod>('week');

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-[0_24px_70px_-60px_rgba(0,0,0,0.95)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-accent drop-shadow" />
          Top Thịnh hành
        </h3>
      </div>

      {/* Period Selector */}
      <div className="flex gap-1 mb-4 bg-white/5 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            period === 'week'
              ? 'bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)]'
              : 'hover:bg-white/10 text-foreground/80'
          }`}
        >
          Tuần
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            period === 'month'
              ? 'bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)]'
              : 'hover:bg-white/10 text-foreground/80'
          }`}
        >
          Tháng
        </button>
        <button
          onClick={() => setPeriod('all')}
          className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            period === 'all'
              ? 'bg-linear-to-r from-primary to-secondary text-primary-foreground shadow-[0_10px_30px_-20px_rgba(0,0,0,0.8)]'
              : 'hover:bg-white/10 text-foreground/80'
          }`}
        >
          Tất cả
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {posts.map((post, index) => {
          const seed = typeof post.id === 'number' ? post.id : post.tenTinTuc.length;
          const fallbackImage = `https://picsum.photos/seed/${seed}/300/300`;
          const imageUrl = post.thumbnail && post.thumbnail.trim() !== '' ? post.thumbnail : fallbackImage;
          const dateValue = post.ngayDang ? new Date(post.ngayDang) : new Date();
          const formattedDate = formatDistanceToNow(dateValue, { addSuffix: true, locale: vi });

          return (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="flex gap-3 p-2 rounded-xl hover:bg-white/10 transition-all group border border-transparent hover:border-white/10"
            >
              <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                <span
                  className={`text-sm font-bold ${
                    index < 3 ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </span>
              </div>
              <div className="w-16 h-16 rounded overflow-hidden shrink-0 ring-1 ring-white/10">
                <img
                  src={imageUrl}
                  alt={post.tenTinTuc}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {post.tenTinTuc}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{post.nguoiDung?.tenNguoiDung || 'Ẩn danh'}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{formattedDate}</span>
                </div>
                <div className="text-[11px] text-muted-foreground/80 mt-1">
                  {post.viewCount.toLocaleString()} lượt xem
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
