'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageSquare, ChevronLeft, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface MyComment {
  id: number;
  noiDungBinhLuan: string;
  ngayBinhLuan: string;
  maTinTuc: number;
  tinTuc: {
    id: number;
    tenTinTuc: string;
  };
}

export default function MyCommentsPage() {
  const [comments, setComments] = useState<MyComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          window.location.href = '/login?redirect=/my-comments';
          return;
        }
        const userData = await authRes.json();
        const userId = userData?.user?.userId;
        if (!userId) return;

        const res = await fetch(`/api/comments/my-comments?userId=${userId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoading(false);
      }
    };

    loadComments();
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
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Bình luận của tôi</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Bạn đã viết {comments.length} bình luận
          </p>
        </div>

        {comments.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Chưa có bình luận nào</h2>
            <p className="text-muted-foreground mb-6">
              Hãy chia sẻ ý kiến của bạn về các bài viết
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
            {comments.map((comment) => {
              const commentDate = formatDistanceToNow(new Date(comment.ngayBinhLuan), {
                addSuffix: true,
                locale: vi,
              });

              return (
                <div
                  key={comment.id}
                  className="border-2 border-white/10 rounded-xl p-6 bg-white/5 hover:border-primary/40 transition-all"
                >
                  <Link
                    href={`/posts/${comment.maTinTuc}`}
                    className="block mb-3 hover:text-primary transition-colors"
                  >
                    <h3 className="text-xl font-bold">
                      {comment.tinTuc.tenTinTuc}
                    </h3>
                  </Link>
                  <div className="bg-muted/30 rounded-lg p-4 mb-3">
                    <p className="text-base leading-relaxed">{comment.noiDungBinhLuan}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>Bình luận {commentDate}</span>
                    <Link
                      href={`/posts/${comment.maTinTuc}`}
                      className="ml-auto text-primary font-semibold hover:underline"
                    >
                      Xem bài viết →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
