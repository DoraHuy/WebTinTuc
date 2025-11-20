'use client';

import { Post } from '@/lib/types/Homepage';
import { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  ChevronLeft,
  Crown,
  User,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { PremiumOverlay } from '@/components/homepage/PremiumBadge';

interface PostDetailClientProps {
  post: Post;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: Date;
  avatar?: string;
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showPremium, setShowPremium] = useState(post.isPremium);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'Nguyễn Văn A',
      content: 'Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ.',
      timestamp: new Date('2024-11-19T10:30:00'),
    },
    {
      id: 2,
      author: 'Trần Thị B',
      content: 'Thông tin rất chi tiết và dễ hiểu. Đánh giá 5 sao!',
      timestamp: new Date('2024-11-19T11:15:00'),
    },
  ]);

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
    }
  };

  const handleComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        author: 'Bạn',
        content: newComment,
        timestamp: new Date(),
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  const handleUnlockPremium = () => {
    setShowPremium(false);
  };

  const formattedDate = formatDistanceToNow(new Date(post.ngayDang), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Quay lại</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
              <span className="font-bold">TechNews</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Post Header */}
        <div className="mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.danhMuc.map((cat) => (
              <span
                key={cat.id}
                className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
              >
                {cat.tenDanhMuc}
              </span>
            ))}
            {post.isPremium && (
              <span className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-4 h-4 fill-white" />
                PREMIUM
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mb-6">{post.tenTinTuc}</h1>

          {/* Meta Info */}
          <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold">
                  {post.nguoiDung.tenNguoiDung[0]}
                </div>
                <div>
                  <p className="font-medium">{post.nguoiDung.tenNguoiDung}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="w-5 h-5" />
                {(post.viewCount || 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-5 h-5" />
                {likeCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-5 h-5" />
                {comments.length}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.thumbnail && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.thumbnail}
              alt={post.tenTinTuc}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* Summary */}
        {post.tomTat && (
          <div className="bg-muted/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
            <p className="text-lg leading-relaxed">{post.tomTat}</p>
          </div>
        )}

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-8 relative">
          {showPremium && <PremiumOverlay onUnlock={handleUnlockPremium} />}
          <div dangerouslySetInnerHTML={{ __html: post.noiDungTinTuc }} />
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-muted text-sm px-3 py-1 rounded-full hover:bg-muted/80 transition-colors cursor-pointer"
              >
                #{tag.tenTag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              liked
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? 'fill-white' : ''}`} />
            <span>{liked ? 'Đã thích' : 'Thích'}</span>
            <span>({likeCount})</span>
          </button>

          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              bookmarked
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
            <span>{bookmarked ? 'Đã lưu' : 'Lưu'}</span>
          </button>

          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-muted hover:bg-muted/80 font-medium transition-all">
            <Share2 className="w-5 h-5" />
            <span>Chia sẻ</span>
          </button>
        </div>

        {/* Comments Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Bình luận ({comments.length})
          </h2>

          {/* Comment Input */}
          <div className="mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  className="w-full px-4 py-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleComment}
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Gửi bình luận
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                  {comment.author[0]}
                </div>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(comment.timestamp, {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
