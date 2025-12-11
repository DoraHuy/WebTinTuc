'use client';

import { TopAuthor, TopPeriod } from '@/types/Homepage';
import { Crown, Medal, Award, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface TopAuthorsProps {
  authors: TopAuthor[];
  type: 'posts' | 'interactions' | 'revenue';
}

export function TopAuthors({ authors, type }: TopAuthorsProps) {
  const [period, setPeriod] = useState<TopPeriod>('week');

  const getTitle = () => {
    switch (type) {
      case 'posts':
        return 'Top Tác giả';
      case 'interactions':
        return 'Top Tương tác';
      case 'revenue':
        return 'Top Nạp tiền';
      default:
        return 'Top';
    }
  };

  const getIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400 fill-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600 fill-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getStatLabel = () => {
    switch (type) {
      case 'posts':
        return 'bài viết';
      case 'interactions':
        return 'tương tác';
      case 'revenue':
        return 'đ';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-[0_24px_70px_-60px_rgba(0,0,0,0.95)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary drop-shadow" />
          {getTitle()}
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

      {/* Authors List */}
      <div className="space-y-3">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/author/${author.id}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10"
          >
            <div className="shrink-0">{getIcon(author.rank)}</div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center font-bold text-sm shrink-0">
              {author.tenNguoiDung[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{author.tenNguoiDung}</p>
              <p className="text-xs text-muted-foreground">
                {author.stats.toLocaleString()} {getStatLabel()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
