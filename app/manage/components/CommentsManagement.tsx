'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Loader } from 'lucide-react';

interface Comment {
  id: number;
  noiDungBinhLuan: string;
  tenNguoiDung: string;
  email: string;
  tenTinTuc: string;
  thoiGianBinhLuan: string;
}

export function CommentsManagement() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments/manage');
      const data = await res.json();
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

    setDeleting(commentId);
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments(comments.filter(c => c.id !== commentId));
        alert('✅ Xóa bình luận thành công');
      } else {
        alert('❌ Lỗi khi xóa bình luận');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('❌ Lỗi khi xóa bình luận');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border-2 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Quản Lý Bình Luận</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 rounded-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-3xl font-bold">Quản Lý Bình Luận</h2>
        <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full font-bold text-lg">
          {comments.length}
        </span>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-lg">
          Không có bình luận nào
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-4 font-bold text-base">Người bình luận</th>
                <th className="text-left p-4 font-bold text-base">Email</th>
                <th className="text-left p-4 font-bold text-base">Nội dung</th>
                <th className="text-left p-4 font-bold text-base">Bài viết</th>
                <th className="text-left p-4 font-bold text-base">Thời gian</th>
                <th className="text-center p-4 font-bold text-base">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id} className="border-b hover:bg-muted/50 transition-all">
                  <td className="p-4">
                    <div className="font-semibold text-base">{comment.tenNguoiDung}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-base text-muted-foreground">{comment.email}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-base line-clamp-2">{comment.noiDungBinhLuan}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-base font-medium line-clamp-1">{comment.tenTinTuc}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-base text-muted-foreground">
                      {new Date(comment.thoiGianBinhLuan).toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deleting === comment.id}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg transition-all disabled:opacity-50 font-semibold text-base"
                    >
                      {deleting === comment.id ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Đang xóa...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          Xóa
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
