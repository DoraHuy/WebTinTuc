'use client';

import { Post } from '@/types/Homepage';
import { useState, useEffect } from 'react';
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
import BuyButton from '@/components/BuyButton';
import { RatingComponent } from '@/components/RatingComponent';

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
  const seed = typeof post.id === 'number' ? post.id : post.tenTinTuc.length;
  const fallbackImage = `https://picsum.photos/seed/${seed}/1200/800`;
  const imageUrl = post.thumbnail && post.thumbnail.trim() !== '' ? post.thumbnail : fallbackImage;

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [showPremium, setShowPremium] = useState(post.isPremium);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(post.isPremium);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Kiểm tra quyền truy cập bài viết premium
  useEffect(() => {
    if (post.isPremium) {
      checkAccess();
    }
  }, [post.id]);

  const checkAccess = async () => {
    try {
      // Lấy userId từ session
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        setHasAccess(false);
        setShowPremium(true);
        setCheckingAccess(false);
        return;
      }
      const userData = await authRes.json();
      const userId = userData?.user?.userId;
      if (!userId) {
        setHasAccess(false);
        setShowPremium(true);
        setCheckingAccess(false);
        return;
      }
      const res = await fetch(`/api/purchased?userId=${userId}&postId=${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setHasAccess(data.hasAccess);
        setShowPremium(!data.hasAccess);
      }
    } catch (error) {
      console.error('Lỗi kiểm tra quyền truy cập:', error);
    } finally {
      setCheckingAccess(false);
    }
  };

  const handleLike = async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        alert('Vui lòng đăng nhập để thích bài viết');
        return;
      }
      const userData = await authRes.json();
      const userId = userData?.user?.userId;
      if (!userId) return;

      if (liked) {
        // Unlike
        const res = await fetch(`/api/ratings?userId=${userId}&postId=${post.id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
        }
      } else {
        // Like
        const res = await fetch('/api/ratings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, postId: post.id, rating: 1 }),
        });
        if (res.ok) {
          setLiked(true);
          setLikeCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    // Load comments, bookmark, and rating from API
    const load = async () => {
      try {
        // Load comments
        const res = await fetch(`/api/comments?postId=${post.id}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const mapped: Comment[] = (data.comments || []).map((c: any) => ({
            id: c.id,
            author: c.nguoiDung?.tenNguoiDung || 'Ẩn danh',
            content: c.noiDungBinhLuan,
            timestamp: new Date(c.ngayBinhLuan),
          }));
          setComments(mapped);
        }

        // Load bookmark and rating status
        const authRes = await fetch('/api/auth/me');
        if (authRes.ok) {
          const userData = await authRes.json();
          const userId = userData?.user?.userId;
          if (userId) {
            // Check bookmark
            const bookmarkRes = await fetch(`/api/bookmarks?userId=${userId}&postId=${post.id}`);
            if (bookmarkRes.ok) {
              const bookmarkData = await bookmarkRes.json();
              setBookmarked(bookmarkData.bookmarked);
            }

            // Check rating/like
            const ratingRes = await fetch(`/api/ratings?userId=${userId}&postId=${post.id}`);
            if (ratingRes.ok) {
              const ratingData = await ratingRes.json();
              setLiked(ratingData.rated);
              if (ratingData.totalRatings) {
                setLikeCount(ratingData.totalRatings);
              }
            }
          }
        }
      } catch {}
    };
    load();
  }, [post.id]);

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, content: newComment.trim() })
      });
      if (res.ok) {
        setNewComment('');
        // reload comments
        const list = await fetch(`/api/comments?postId=${post.id}`, { cache: 'no-store' });
        if (list.ok) {
          const data = await list.json();
          const mapped: Comment[] = (data.comments || []).map((c: any) => ({
            id: c.id,
            author: c.nguoiDung?.tenNguoiDung || 'Ẩn danh',
            content: c.noiDungBinhLuan,
            timestamp: new Date(c.ngayBinhLuan),
          }));
          setComments(mapped);
        }
      }
    } catch {}
  };

  const handleUnlockPremium = (password: string) => {
    // Mở khóa khi nhập đúng mật khẩu "HUANDZ"
    if (password.toUpperCase() === 'HUANDZ') {
      setShowPremium(false);
    }
  };

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      setRedeemMessage({ type: 'error', text: 'Vui lòng nhập mã code' });
      return;
    }

    // Kiểm tra đăng nhập
    const checkAuth = await fetch('/api/auth/me');
    if (!checkAuth.ok) {
      setRedeemMessage({ type: 'error', text: '⚠️ Vui lòng đăng nhập để sử dụng mã' });
      setTimeout(() => {
        window.location.href = '/login?redirect=/posts/' + post.id;
      }, 1500);
      return;
    }

    setRedeemLoading(true);
    setRedeemMessage(null);

    try {
      const userData = await checkAuth.json();
      const userId = userData?.user?.userId;
      if (!userId) {
        setRedeemMessage({ type: 'error', text: 'Không xác định được người dùng' });
        setRedeemLoading(false);
        return;
      }
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: String(userId), code: redeemCode.trim().toUpperCase() }),
      });

      const data = await res.json();

      if (res.ok) {
        setRedeemMessage({ type: 'success', text: data.message || 'Sử dụng mã thành công!' });
        setRedeemCode('');
        // Refresh access check
        setTimeout(() => {
          checkAccess();
          window.location.reload();
        }, 1500);
      } else {
        setRedeemMessage({ type: 'error', text: data.error || 'Mã không hợp lệ' });
      }
    } catch (error) {
      setRedeemMessage({ type: 'error', text: 'Lỗi khi sử dụng mã' });
    } finally {
      setRedeemLoading(false);
    }
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
        <div className="mb-8 rounded-xl overflow-hidden">
          <img
            src={imageUrl}
            alt={post.tenTinTuc}
            className="w-full aspect-video object-cover"
          />
        </div>

        {/* Summary */}
        {post.tomTat && (
          <div className="bg-muted/50 border-l-4 border-primary p-6 rounded-r-lg mb-8">
            <p className="text-lg leading-relaxed">{post.tomTat}</p>
          </div>
        )}

        {/* Premium Actions - Hiện các tùy chọn cho bài premium */}
        {post.isPremium && !hasAccess && !checkingAccess && (
          <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Bài viết Premium</h3>
                <p className="text-muted-foreground">
                  Đây là bài viết cao cấp. Bạn có thể mua trực tiếp, dùng mã code, hoặc đăng bài để nhận mã miễn phí!
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-2">
                  <strong>📌 Lưu ý:</strong> Tác giả cũng phải mua/dùng mã để đọc bài premium của người khác. 
                  Chỉ được xem miễn phí ở trang "Bài đã gửi" → "Bài đã duyệt".
                </p>
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    🔐 <strong>Bạn cần đăng nhập</strong> để mua bài, sử dụng mã code, hoặc đăng bài nhận mã miễn phí.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Option 1: Mua trực tiếp */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-5 border-2 border-transparent hover:border-primary transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Mua ngay</h4>
                    <p className="text-lg font-semibold text-primary">{(post.gia || 0).toLocaleString()}đ</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Thanh toán một lần và đọc vĩnh viễn
                </p>
                <BuyButton
                  postId={post.id}
                  price={post.gia || 0}
                  isPremium={post.isPremium}
                  hasAccess={hasAccess}
                />
              </div>

              {/* Option 2: Nhập mã Redeem */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-5 border-2 border-purple-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Dùng mã Redeem</h4>
                    <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">CÓ MÃ RỒI</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Đã có mã? Nhập ngay để đọc miễn phí
                </p>
                
                <div className="space-y-2">
                  <input
                    type="text"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã code..."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700"
                    disabled={redeemLoading}
                  />
                  <button
                    onClick={handleRedeemCode}
                    disabled={redeemLoading || !redeemCode.trim()}
                    className="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {redeemLoading ? 'Đang xử lý...' : 'Sử dụng mã'}
                  </button>
                  
                  {redeemMessage && (
                    <div className={`text-xs p-2 rounded ${
                      redeemMessage.type === 'success' 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    }`}>
                      {redeemMessage.text}
                    </div>
                  )}
                </div>
              </div>

              {/* Option 3: Đăng bài để đọc */}
              <div className="bg-white dark:bg-gray-900 rounded-lg p-5 border-2 border-transparent hover:border-green-500 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">✍️</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Đăng bài để đọc</h4>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">MIỄN PHÍ</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Viết bài và nhận mã code để đọc premium
                </p>
                <Link 
                  href="/posts/submit"
                  className="block w-full text-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Đăng bài ngay
                </Link>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                💡 <strong>Mẹo:</strong> Đăng bài free (miễn phí) sẽ nhận được mã code sau khi admin duyệt. 
                Dùng mã code này để đọc bất kỳ bài premium nào!
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-8 relative">
          {showPremium && !hasAccess && (
            <PremiumOverlay onUnlock={handleUnlockPremium} />
          )}
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
            onClick={async () => {
              try {
                const authRes = await fetch('/api/auth/me');
                if (!authRes.ok) {
                  alert('Vui lòng đăng nhập để lưu bài viết');
                  return;
                }
                const userData = await authRes.json();
                const userId = userData?.user?.userId;
                if (!userId) return;

                if (bookmarked) {
                  // Remove bookmark
                  const res = await fetch(`/api/bookmarks?userId=${userId}&postId=${post.id}`, {
                    method: 'DELETE',
                  });
                  if (res.ok) {
                    setBookmarked(false);
                  }
                } else {
                  // Add bookmark
                  const res = await fetch('/api/bookmarks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, postId: post.id }),
                  });
                  if (res.ok) {
                    setBookmarked(true);
                  }
                }
              } catch (error) {
                console.error('Error toggling bookmark:', error);
              }
            }}
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

        {/* Rating Section */}
        <div className="mb-8 p-6 rounded-lg bg-muted/50 border">
          <h3 className="text-lg font-semibold mb-4">Đánh giá bài viết</h3>
          <RatingComponent postId={post.id} />
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
