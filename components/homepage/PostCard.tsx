import { Post } from '@/lib/types/Homepage';
import Link from 'next/link';
import { Clock, Eye, MessageCircle, Heart, Crown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const formattedDate = formatDistanceToNow(new Date(post.ngayDang), {
    addSuffix: true,
    locale: vi,
  });

  if (variant === 'compact') {
    return (
      <Link
        href={`/posts/${post.id}`}
        className="group block p-3 hover:bg-muted/50 rounded-lg transition-colors"
      >
        <div className="flex gap-3">
          {post.thumbnail && (
            <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden">
              <img
                src={post.thumbnail}
                alt={post.tenTinTuc}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {post.isPremium && (
                <div className="absolute top-1 right-1">
                  <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {post.tenTinTuc}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/posts/${post.id}`}
        className="group block overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all"
      >
        <div className="relative aspect-video overflow-hidden">
          {post.thumbnail ? (
            <img
              src={post.thumbnail}
              alt={post.tenTinTuc}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl">📰</span>
            </div>
          )}
          {post.isPremium && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
              <Crown className="w-4 h-4 fill-white" />
              <span className="text-xs font-semibold">PREMIUM</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex flex-wrap gap-2">
              {post.danhMuc.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded"
                >
                  {cat.tenDanhMuc}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {post.tenTinTuc}
          </h2>
          {post.tomTat && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {post.tomTat}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/author/${post.nguoiDung.id}`;
              }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                {post.nguoiDung.tenNguoiDung[0]}
              </div>
              <div>
                <p className="text-sm font-medium">{post.nguoiDung.tenNguoiDung}</p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.viewCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.likeCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.commentCount || 0}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block overflow-hidden rounded-lg border bg-card hover:shadow-md transition-all"
    >
      <div className="flex gap-4 p-4">
        {post.thumbnail && (
          <div className="relative w-32 h-32 flex-shrink-0 rounded overflow-hidden">
            <img
              src={post.thumbnail}
              alt={post.tenTinTuc}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            {post.isPremium && (
              <div className="absolute top-2 right-2">
                <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow" />
              </div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {post.danhMuc.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded"
              >
                {cat.tenDanhMuc}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {post.tenTinTuc}
          </h3>
          {post.tomTat && (
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {post.tomTat}
            </p>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="font-medium hover:text-primary transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `/author/${post.nguoiDung.id}`;
                }}
              >
                {post.nguoiDung.tenNguoiDung}
              </span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {post.viewCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                {post.likeCount || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3.5 h-3.5" />
                {post.commentCount || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
