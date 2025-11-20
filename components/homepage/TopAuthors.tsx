'use client';

import { TopAuthor, TopPeriod } from '@/lib/types/Homepage';
import { Crown, Medal, Award, TrendingUp } from 'lucide-react';
import { useState } from 'react';

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
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {getTitle()}
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

      {/* Authors List */}
      <div className="space-y-3">
        {authors.map((author) => (
          <div
            key={author.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <div className="flex-shrink-0">{getIcon(author.rank)}</div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {author.tenNguoiDung[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{author.tenNguoiDung}</p>
              <p className="text-xs text-muted-foreground">
                {author.stats.toLocaleString()} {getStatLabel()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
