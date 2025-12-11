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
    <div className="p-8 space-y-6 bg-white text-black">
      <div className="flex items-center justify-between border-b border-gray-300 pb-4">
        <h1 className="text-5xl font-bold text-black">Quản lý bài viết</h1>
        <Button onClick={() => setIsAdding(true)} className="flex items-center gap-2 px-6 py-6 text-lg font-bold shadow-lg bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="w-5 h-5" />
          Thêm bài viết
        </Button>
      </div>

      {message && (
        <div className="p-5 rounded-xl bg-blue-50 border-2 border-blue-200 text-lg font-bold text-black">
          {message}
        </div>
      )}

      <input
        type="text"
        placeholder="Tìm kiếm bài viết hoặc tác giả..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-6 py-4 text-lg font-bold border-2 border-gray-300 rounded-xl bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      />

      {isAdding && (
        <div className="rounded-xl border-2 border-gray-300 bg-white p-8 space-y-5 shadow-lg">
          <h2 className="text-3xl font-bold text-black">Thêm bài viết mới</h2>
          <input
            type="text"
            placeholder="Tiêu đề"
            value={newPost.tenTinTuc}
            onChange={(e) => setNewPost({ ...newPost, tenTinTuc: e.target.value })}
            className="w-full px-5 py-4 text-lg font-bold border-2 border-gray-300 rounded-lg bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <textarea
            placeholder="Tóm tắt"
            value={newPost.tomTat}
            onChange={(e) => setNewPost({ ...newPost, tomTat: e.target.value })}
            className="w-full px-5 py-4 text-lg font-semibold border-2 border-gray-300 rounded-lg bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            rows={3}
          />
          <textarea
            placeholder="Nội dung"
            value={newPost.noiDungTinTuc}
            onChange={(e) => setNewPost({ ...newPost, noiDungTinTuc: e.target.value })}
            className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-lg bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            rows={6}
          />
          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-3 text-lg font-bold cursor-pointer text-black">
              <input
                type="checkbox"
                checked={newPost.isPremium}
                onChange={(e) => setNewPost({ ...newPost, isPremium: e.target.checked })}
                className="w-5 h-5 cursor-pointer"
              />
              Premium
            </label>
            {newPost.isPremium && (
              <input
                type="number"
                placeholder="Giá"
                value={newPost.gia}
                onChange={(e) => setNewPost({ ...newPost, gia: Number(e.target.value) })}
                className="w-40 px-5 py-3 text-lg font-bold border-2 border-gray-300 rounded-lg bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={handleAdd} disabled={loading} className="px-8 py-6 text-lg font-bold shadow-lg bg-blue-600 text-white hover:bg-blue-700">
              Lưu
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)} className="px-8 py-6 text-lg font-bold border-2 border-gray-300 bg-white text-black hover:bg-gray-100">
              Hủy
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border-2 border-gray-300 overflow-x-auto shadow-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="w-16 p-5 font-bold text-lg text-black">ID</TableHead>
              <TableHead className="min-w-[250px] p-5 font-bold text-lg text-black">Tiêu đề</TableHead>
              <TableHead className="min-w-[200px] p-5 font-bold text-lg text-black">Tóm tắt</TableHead>
              <TableHead className="w-40 p-5 font-bold text-lg text-black">Ngày đăng</TableHead>
              <TableHead className="w-32 p-5 font-bold text-lg text-black">Tác giả</TableHead>
              <TableHead className="w-28 p-5 font-bold text-lg text-black">Loại</TableHead>
              <TableHead className="w-32 p-5 font-bold text-lg text-black">Giá</TableHead>
              <TableHead className="w-32 p-5 font-bold text-lg text-black">Trạng thái</TableHead>
              <TableHead className="w-40 text-center p-5 font-bold text-lg text-black">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.id} className="hover:bg-gray-50 transition-all bg-white border-t border-gray-200">
                <TableCell className="p-5 font-bold text-lg text-black">{post.id}</TableCell>
                <TableCell className="p-5">
                  {editingId === post.id ? (
                    <input
                      type="text"
                      value={editForm.tenTinTuc}
                      onChange={(e) => setEditForm({ ...editForm, tenTinTuc: e.target.value })}
                      className="w-full px-5 py-3 text-lg font-bold border-2 border-gray-300 rounded-lg bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  ) : (
                    <span className="line-clamp-2 text-lg font-bold text-black">{post.tenTinTuc}</span>
                  )}
                </TableCell>
                <TableCell className="p-5">
                  {editingId === post.id ? (
                    <textarea
                      value={editForm.tomTat}
                      onChange={(e) => setEditForm({ ...editForm, tomTat: e.target.value })}
                      className="w-full px-5 py-3 text-lg font-semibold border-2 border-gray-300 rounded-lg bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      rows={3}
                    />
                  ) : (
                    <span className="line-clamp-2 text-lg text-black">{post.tomTat}</span>
                  )}
                </TableCell>
                <TableCell className="p-5 text-lg font-semibold text-black">
                  {new Date(post.ngayDang).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell className="p-5 text-lg font-bold text-black">{post.nguoiDung.tenNguoiDung}</TableCell>
                <TableCell className="p-5">
                  {editingId === post.id ? (
                    <input
                      type="checkbox"
                      checked={editForm.isPremium}
                      onChange={(e) => setEditForm({ ...editForm, isPremium: e.target.checked })}
                      className="w-5 h-5 cursor-pointer"
                    />
                  ) : (
                    <span className={`text-base px-4 py-2 rounded-lg font-bold ${post.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {post.isPremium ? 'Premium' : 'Free'}
                    </span>
                  )}
                </TableCell>
                <TableCell className="p-5">
                  {editingId === post.id ? (
                    <input
                      type="number"
                      value={editForm.gia}
                      onChange={(e) => setEditForm({ ...editForm, gia: Number(e.target.value) })}
                      className="w-32 px-5 py-3 text-lg font-bold border-2 border-gray-300 rounded-lg bg-white text-black focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    />
                  ) : (
                    <span className="text-lg font-bold text-black">{post.gia?.toLocaleString()}đ</span>
                  )}
                </TableCell>
                <TableCell className="p-5">
                  <span className={`text-base px-4 py-2 rounded-lg font-bold ${post.trangThaiDuyet ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                    {post.trangThaiDuyet ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                </TableCell>
                <TableCell className="p-5">
                  {editingId === post.id ? (
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => handleSave(post.id)}
                        disabled={loading}
                        className="px-5 py-2 font-bold border-2 border-green-600 bg-white text-green-600 hover:bg-green-50 shadow-md hover:shadow-lg"
                      >
                        <Check className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        className="px-5 py-2 font-bold border-2 border-gray-300 bg-white text-black hover:bg-gray-100"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(post)}
                        disabled={loading}
                        className="px-5 py-2 font-bold border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50"
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(post.id)}
                        disabled={loading}
                        className="px-5 py-2 font-bold shadow-md hover:shadow-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-lg font-bold text-black bg-gray-100 p-5 rounded-xl border-2 border-gray-300">
        Hiển thị {filteredPosts.length} / {data.length} bài viết
      </div>
    </div>
  );
}