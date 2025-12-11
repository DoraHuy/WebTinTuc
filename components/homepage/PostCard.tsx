import { Post } from '@/types/Homepage';
import Link from 'next/link';
import { Clock, Eye, MessageCircle, Heart, Crown } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import AddToCartButton from '@/components/AddToCartButton';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  if (!post) return null;
  const dateValue = post.ngayDang ? new Date(post.ngayDang) : new Date();
  const formattedDate = formatDistanceToNow(dateValue, {
    addSuffix: true,
    locale: vi,
  });
  const seed = typeof post.id === 'number' ? post.id : post.tenTinTuc.length;
  const fallbackImage = `https://picsum.photos/seed/${seed}/800/600`;
  const imageUrl = post.thumbnail && post.thumbnail.trim() !== '' ? post.thumbnail : fallbackImage;

  if (variant === 'compact') {
    return (
      <Link
        href={`/posts/${post.id}`}
        className="group block p-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur hover:border-primary/40 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] transition-all"
      >
        <div className="flex gap-3">
          <div className="relative w-20 h-20 shrink-0 rounded overflow-hidden ring-1 ring-white/15">
            <img
              src={imageUrl}
              alt={post.tenTinTuc}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            {post.isPremium && (
              <div className="absolute top-1 right-1">
                <Crown className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
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
        className="group block overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-card/80 to-background/60 backdrop-blur shadow-[0_28px_80px_-60px_rgba(0,0,0,0.95)] hover:-translate-y-1 transition-all"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={post.tenTinTuc}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {post.isPremium && (
            <div className="absolute top-3 right-3 bg-linear-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded-full flex items-center gap-1 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.9)] border border-white/20">
              <Crown className="w-4 h-4 fill-primary-foreground" />
              <span className="text-xs font-semibold">PREMIUM</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 via-black/10 to-transparent p-4">
            <div className="flex flex-wrap gap-2">
              {post.danhMuc.slice(0, 2).map((cat) => (
                <span
                  key={cat.id}
                  className="bg-white/15 text-primary-foreground text-xs px-2 py-1 rounded border border-white/20 backdrop-blur"
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
              <div className="w-9 h-9 rounded-full bg-primary/15 border border-white/15 flex items-center justify-center text-sm font-semibold">
                {post.nguoiDung.tenNguoiDung[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{post.nguoiDung.tenNguoiDung}</p>
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10 text-xs text-muted-foreground">
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
          {post.isPremium && (
            <div className="p-3 border-t border-white/10 mt-2 bg-white/5 rounded-xl">
              <AddToCartButton postId={post.id} price={post.gia || 0} />
            </div>
          )}
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/posts/${post.id}`}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow-[0_20px_70px_-60px_rgba(0,0,0,0.9)] hover:-translate-y-0.5 hover:border-primary/40 transition-all"
    >
      <div className="flex gap-4 p-4">
        <div className="relative w-32 h-32 shrink-0 rounded overflow-hidden ring-1 ring-white/15">
          <img
            src={imageUrl}
            alt={post.tenTinTuc}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {post.isPremium && (
            <div className="absolute top-2 right-2">
              <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            {post.danhMuc.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="bg-primary/15 text-primary text-xs px-2 py-0.5 rounded border border-white/15"
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
