'use client';

import React, { useState } from 'react';
import { FileText, Eye, Heart, MessageCircle, DollarSign, TrendingUp, Crown, Plus, FileEdit, Trash2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Post } from '@/lib/types/Homepage';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { deletePost, publishPost } from '@/lib/actions/post'; // Import hàm xóa
import {
    // ... các icon cũ
    Send, // Thêm icon Send
} from 'lucide-react';

interface AuthorData {
    id: number;
    tenNguoiDung: string;
    email: string;
    avatar: string;
    totalPosts: number;
    totalInteractions: number;
    totalRevenue: number;
    posts: Post[];
}

interface AuthorPageClientProps {
    authors: AuthorData[];
}

export default function AuthorPageClient({ authors }: AuthorPageClientProps) {
    const [selectedAuthorId, setSelectedAuthorId] = useState<number | null>(authors.length > 0 ? authors[0].id : null);

    const currentAuthor = selectedAuthorId
        ? authors.find(a => a.id === selectedAuthorId)
        : null;

    const authorPosts = currentAuthor ? currentAuthor.posts : [];

    const totalViews = authorPosts.reduce((sum, p) => sum + (p.viewCount || 0), 0);
    const totalLikes = authorPosts.reduce((sum, p) => sum + (p.likeCount || 0), 0);
    const totalComments = authorPosts.reduce((sum, p) => sum + (p.commentCount || 0), 0);
    const premiumPosts = authorPosts.filter(p => p.isPremium).length;

    // Xử lý xóa bài viết
    const handleDelete = async (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            await deletePost(id);
        }
    };
    const handlePublish = async (id: number) => {
        if (confirm('Bạn muốn đăng bài viết này lên trang chủ?')) {
            await publishPost(id);
        }
    };

    // Helper hiển thị trạng thái
    const getStatusBadge = (status: boolean | null | undefined) => {
        // Trường hợp ĐÃ DUYỆT (Publish)
        if (status === true) {
            return <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Đã duyệt</span>;
        }

        // Trường hợp TỪ CHỐI (Nếu bạn có chức năng Admin từ chối bài)
        // Tạm thời bỏ qua hoặc để logic riêng nếu cần

        // Trường hợp CHỜ DUYỆT (Mặc định false hoặc null)
        return <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded-full"><Clock className="w-3 h-3" /> Chờ duyệt</span>;
    };

    return (
        <div className="min-h-screen bg-background p-6 space-y-6">

            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Trang Tác Giả</h1>
                    <p className="text-muted-foreground">Quản lý bài viết, theo dõi trạng thái và thống kê</p>
                </div>
                <Link href="/TacGia/Posts/create">
                    <Button className="bg-primary text-primary-foreground shadow-lg hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" /> Viết bài mới
                    </Button>
                </Link>
            </div>

            {/* Danh sách Tác Giả */}
            <div className="bg-card border rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Danh Sách Tác Giả ({authors.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {authors.map((author) => (
                        <button
                            key={author.id}
                            onClick={() => setSelectedAuthorId(author.id)}
                            className={`p-4 rounded-lg border text-left transition-all ${selectedAuthorId === author.id
                                ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                : 'bg-card hover:bg-muted/50'
                                }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 overflow-hidden flex items-center justify-center">
                                    <img src={author.avatar} alt={author.tenNguoiDung} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="font-semibold">{author.tenNguoiDung}</div>
                                    <div className={`text-xs ${selectedAuthorId === author.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{author.email}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-white/10">
                                <div><div className="font-bold">{author.totalPosts}</div><div className="opacity-80">Bài viết</div></div>
                                <div><div className="font-bold">{(author.totalInteractions / 1000).toFixed(1)}k</div><div className="opacity-80">Tương tác</div></div>
                                <div><div className="font-bold">{(author.totalRevenue / 1000000).toFixed(1)}M</div><div className="opacity-80">Doanh thu</div></div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chi Tiết & Danh Sách Bài Viết */}
            {currentAuthor && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Thống kê cards (Giữ nguyên code cũ, chỉ rút gọn để dễ nhìn) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* ... Code phần thống kê giữ nguyên như trước ... */}
                        <div className="bg-card border rounded-lg p-6 shadow-sm"><div className="flex justify-between mb-2"><span className="text-muted-foreground text-sm">Tổng bài viết</span><FileText className="w-5 h-5 text-primary" /></div><div className="text-3xl font-bold">{currentAuthor.totalPosts}</div><div className="text-xs text-muted-foreground mt-1">{premiumPosts} bài Premium</div></div>
                        <div className="bg-card border rounded-lg p-6 shadow-sm"><div className="flex justify-between mb-2"><span className="text-muted-foreground text-sm">Tổng lượt xem</span><Eye className="w-5 h-5 text-green-500" /></div><div className="text-3xl font-bold">{totalViews.toLocaleString()}</div><div className="text-xs text-muted-foreground mt-1">Lượt xem toàn trang</div></div>
                        <div className="bg-card border rounded-lg p-6 shadow-sm"><div className="flex justify-between mb-2"><span className="text-muted-foreground text-sm">Tương tác</span><TrendingUp className="w-5 h-5 text-blue-500" /></div><div className="text-3xl font-bold">{currentAuthor.totalInteractions.toLocaleString()}</div><div className="text-xs text-muted-foreground mt-1">{totalLikes} likes • {totalComments} cmts</div></div>
                        <div className="bg-card border rounded-lg p-6 shadow-sm"><div className="flex justify-between mb-2"><span className="text-muted-foreground text-sm">Doanh thu</span><DollarSign className="w-5 h-5 text-yellow-500" /></div><div className="text-3xl font-bold text-yellow-600">{(currentAuthor.totalRevenue / 1000000).toFixed(1)}M</div><div className="text-xs text-muted-foreground mt-1">VNĐ</div></div>
                    </div>

                    {/* Bảng Danh Sách Bài Viết (CẬP NHẬT MỚI) */}
                    <div className="bg-card border rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Danh Sách Bài Viết ({authorPosts.length})
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="text-left p-3 font-semibold rounded-tl-lg">ID</th>
                                        <th className="text-left p-3 font-semibold w-1/3">Tiêu đề</th>
                                        <th className="text-center p-3 font-semibold">Trạng thái</th> {/* CỘT MỚI */}
                                        <th className="text-center p-3 font-semibold">Loại</th>
                                        <th className="text-center p-3 font-semibold"><Eye className="w-4 h-4 inline" /></th>
                                        <th className="text-right p-3 font-semibold">Ngày đăng</th>
                                        <th className="text-center p-3 font-semibold rounded-tr-lg">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {authorPosts.length > 0 ? (
                                        authorPosts.map((post) => (
                                            <tr key={post.id} className="border-b hover:bg-muted/50 transition-colors">
                                                {/* 1. ID */}
                                                <td className="p-3 font-mono text-muted-foreground">#{post.id}</td>

                                                {/* 2. Tiêu đề */}
                                                <td className="p-3">
                                                    <div className="font-medium line-clamp-1" title={post.tenTinTuc}>{post.tenTinTuc}</div>
                                                </td>

                                                {/* 3. Trạng thái */}
                                                <td className="p-3 text-center">
                                                    {/* Truyền trực tiếp giá trị status vào hàm getStatusBadge */}
                                                    {getStatusBadge(post.trangThaiDuyet)}
                                                </td>

                                                {/* 4. Loại (Free/Premium) - ĐÃ SỬA VỊ TRÍ */}
                                                <td className="p-3 text-center">
                                                    {post.isPremium ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            <Crown className="w-3 h-3" /> Premium
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">Free</span>
                                                    )}
                                                </td>

                                                {/* 5. Lượt xem - ĐÃ SỬA VỊ TRÍ */}
                                                <td className="p-3 text-center">{post.viewCount?.toLocaleString()}</td>

                                                {/* 6. Ngày đăng - ĐÃ SỬA VỊ TRÍ */}
                                                <td className="p-3 text-right text-muted-foreground">
                                                    {new Date(post.ngayDang).toLocaleDateString('vi-VN')}
                                                </td>

                                                {/* 7. Thao tác (Nút bấm) - ĐÃ SỬA VỊ TRÍ */}
                                                <td className="p-3 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        {/* Nút Đăng bài: Chỉ hiện khi CHƯA duyệt (false hoặc null) */}
                                                        {!post.trangThaiDuyet && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                                                                title="Đăng lên trang web"
                                                                onClick={() => handlePublish(post.id)}
                                                            >
                                                                <Send className="w-4 h-4" />
                                                            </Button>
                                                        )}

                                                        {/* Nút Sửa */}
                                                        <Link href={`/TacGia/Posts/${post.id}/edit`}>
                                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Chỉnh sửa">
                                                                <FileEdit className="w-4 h-4 text-blue-600" />
                                                            </Button>
                                                        </Link>

                                                        {/* Nút Xóa */}
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 hover:bg-red-50"
                                                            title="Xóa bài"
                                                            onClick={() => handleDelete(post.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                                Chưa có bài viết nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}