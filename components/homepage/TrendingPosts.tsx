'use client';

import { TrendingPost, TopPeriod } from '@/lib/types/Homepage';
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
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Top Thịnh hành
        </h3>
      </div>

      {/* Period Selector */}
      <div className="flex gap-1 mb-4 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setPeriod('week')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            period === 'week'
              ? 'bg-background shadow-sm'
              : 'hover:bg-background/50'
          }`}
        >
          Tuần
        </button>
        <button
          onClick={() => setPeriod('month')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            period === 'month'
              ? 'bg-background shadow-sm'
              : 'hover:bg-background/50'
          }`}
        >
          Tháng
        </button>
        <button
          onClick={() => setPeriod('all')}
          className={`flex-1 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            period === 'all'
              ? 'bg-background shadow-sm'
              : 'hover:bg-background/50'
          }`}
        >
          Tất cả
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <span
                className={`text-sm font-bold ${
                  index < 3 ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {index + 1}
              </span>
            </div>
            {post.thumbnail && (
              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                <img
                  src={post.thumbnail}
                  alt={post.tenTinTuc}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                {post.tenTinTuc}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{post.viewCount.toLocaleString()} views</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(post.ngayDang), {
                    addSuffix: true,
                    locale: vi,
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
