'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';

interface Post {
  id: number;
  tenTinTuc: string;
  tomTat: string;
  noiDungTinTuc: string;
  ngayDang: string;
  isPremium: boolean;
  gia: number;
  trangThaiDuyet: boolean | null;
  nguoiDung: { id: number; tenNguoiDung: string };
  danhMuc: { id: number; tenDanhMuc: string }[];
  tags: { id: number; tenTag: string }[];
}

interface Category {
  id: number;
  tenDanhMuc: string;
}

interface User {
  id: number;
  tenNguoiDung: string;
}

interface Props {
  posts: Post[];
  categories: Category[];
  users: User[];
}

export default function PostsManageClient({ posts, categories, users }: Props) {
  const [data, setData] = useState<Post[]>(posts);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Post>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newPost, setNewPost] = useState<Partial<Post>>({
    tenTinTuc: '',
    tomTat: '',
    noiDungTinTuc: '',
    isPremium: false,
    gia: 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = data.filter(
    (p) =>
      p.tenTinTuc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nguoiDung.tenNguoiDung.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (post: Post) => {
    setEditingId(post.id);
    setEditForm(post);
  };

  const handleSave = async (id: number) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/manage/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage(`✅ Cập nhật bài viết #${id} thành công`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(`❌ ${result.error || 'Lỗi cập nhật'}`);
      }
    } catch (e) {
      setMessage('❌ Lỗi kết nối');
    } finally {
      setLoading(false);
      setEditingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Xác nhận xóa bài viết #${id}?`)) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/manage/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage(`✅ Xóa bài viết #${id} thành công`);
        setData(data.filter((p) => p.id !== id));
      } else {
        setMessage(`❌ ${result.error || 'Lỗi xóa'}`);
      }
    } catch (e) {
      setMessage('❌ Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newPost.tenTinTuc || !newPost.noiDungTinTuc) {
      setMessage('❌ Vui lòng điền tiêu đề và nội dung');
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/manage/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const result = await res.json();
      if (res.ok) {
        setMessage(`✅ Thêm bài viết thành công`);
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage(`❌ ${result.error || 'Lỗi thêm'}`);
      }
    } catch (e) {
      setMessage('❌ Lỗi kết nối');
    } finally {
      setLoading(false);
      setIsAdding(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Thêm bài viết
        </Button>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-muted border text-sm">
          {message}
        </div>
      )}

      <input
        type="text"
        placeholder="Tìm kiếm bài viết hoặc tác giả..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
      />

      {isAdding && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <h2 className="text-lg font-semibold">Thêm bài viết mới</h2>
          <input
            type="text"
            placeholder="Tiêu đề"
            value={newPost.tenTinTuc}
            onChange={(e) => setNewPost({ ...newPost, tenTinTuc: e.target.value })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
          <textarea
            placeholder="Tóm tắt"
            value={newPost.tomTat}
            onChange={(e) => setNewPost({ ...newPost, tomTat: e.target.value })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            rows={2}
          />
          <textarea
            placeholder="Nội dung"
            value={newPost.noiDungTinTuc}
            onChange={(e) => setNewPost({ ...newPost, noiDungTinTuc: e.target.value })}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            rows={5}
          />
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newPost.isPremium}
                onChange={(e) => setNewPost({ ...newPost, isPremium: e.target.checked })}
              />
              Premium
            </label>
            {newPost.isPremium && (
              <input
                type="number"
                placeholder="Giá"
                value={newPost.gia}
                onChange={(e) => setNewPost({ ...newPost, gia: Number(e.target.value) })}
                className="w-32 px-3 py-1 border rounded dark:bg-gray-800 dark:border-gray-700"
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={loading}>
              Lưu
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">ID</TableHead>
              <TableHead className="min-w-[200px]">Tiêu đề</TableHead>
              <TableHead className="min-w-[150px]">Tóm tắt</TableHead>
              <TableHead className="w-32">Ngày đăng</TableHead>
              <TableHead className="w-24">Tác giả</TableHead>
              <TableHead className="w-20">Loại</TableHead>
              <TableHead className="w-24">Giá</TableHead>
              <TableHead className="w-24">Trạng thái</TableHead>
              <TableHead className="w-32 text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>{post.id}</TableCell>
                <TableCell>
                  {editingId === post.id ? (
                    <input
                      type="text"
                      value={editForm.tenTinTuc}
                      onChange={(e) => setEditForm({ ...editForm, tenTinTuc: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
                    />
                  ) : (
                    <span className="line-clamp-2">{post.tenTinTuc}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === post.id ? (
                    <textarea
                      value={editForm.tomTat}
                      onChange={(e) => setEditForm({ ...editForm, tomTat: e.target.value })}
                      className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
                      rows={2}
                    />
                  ) : (
                    <span className="line-clamp-2 text-sm">{post.tomTat}</span>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(post.ngayDang).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell className="text-sm">{post.nguoiDung.tenNguoiDung}</TableCell>
                <TableCell>
                  {editingId === post.id ? (
                    <input
                      type="checkbox"
                      checked={editForm.isPremium}
                      onChange={(e) => setEditForm({ ...editForm, isPremium: e.target.checked })}
                    />
                  ) : (
                    <span className={`text-xs px-2 py-1 rounded ${post.isPremium ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                      {post.isPremium ? 'Premium' : 'Free'}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === post.id ? (
                    <input
                      type="number"
                      value={editForm.gia}
                      onChange={(e) => setEditForm({ ...editForm, gia: Number(e.target.value) })}
                      className="w-20 px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:border-gray-700"
                    />
                  ) : (
                    <span className="text-sm">{post.gia?.toLocaleString()}đ</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded ${post.trangThaiDuyet ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                    {post.trangThaiDuyet ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                </TableCell>
                <TableCell>
                  {editingId === post.id ? (
                    <div className="flex gap-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSave(post.id)}
                        disabled={loading}
                        className="h-8 w-8 p-0"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(post)}
                        disabled={loading}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(post.id)}
                        disabled={loading}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Hiển thị {filteredPosts.length} / {data.length} bài viết
      </div>
    </div>
  );
}
