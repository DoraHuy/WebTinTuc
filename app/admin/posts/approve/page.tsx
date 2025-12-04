'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Filter, Eye, User } from "lucide-react";
import Link from "next/link";
import { Toast, useToast } from "@/components/ui/toast";

interface PendingPost {
    id: number;
    tieuDe: string;
    noiDung: string;
    hinhAnh?: string;
    isPremium: boolean;
    ngayGui: string;
    nguoiDung: {
        id: number;
        tenNguoiDung: string;
        email: string;
    };
}

export default function AdminApprovePage() {
    const [posts, setPosts] = useState<PendingPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<number | null>(null);
    const [filter, setFilter] = useState<'all' | 'free' | 'premium'>('all');
    const { toasts, showToast, removeToast, success, error } = useToast();
    const [adminId, setAdminId] = useState<number | null>(null);

    useEffect(() => {
        fetchAdminId();
    }, []);

    const fetchAdminId = async () => {
        try {
            const response = await fetch("/api/auth/me");
            const data = await response.json();
            if (data.authenticated && data.user?.userId) {
                setAdminId(data.user.userId);
                fetchPendingPosts();
            }
        } catch (error) {
            console.error("Error fetching admin:", error);
        }
    };

    const fetchPendingPosts = async () => {
        try {
            const response = await fetch("/api/admin/posts/approve");
            const data = await response.json();
            
            if (response.ok) {
                setPosts(data.posts);
            } else {
                error(data.error || "Không thể tải danh sách");
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            error("Lỗi kết nối");
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = posts.filter(post => {
        if (filter === 'free') return !post.isPremium;
        if (filter === 'premium') return post.isPremium;
        return true;
    });

    const stats = {
        total: posts.length,
        free: posts.filter(p => !p.isPremium).length,
        premium: posts.filter(p => p.isPremium).length,
    };

    const handleApprove = async (submissionId: number) => {
        if (!confirm("Bạn có chắc muốn duyệt bài viết này?")) return;

        setProcessing(submissionId);
        try {
            const response = await fetch("/api/admin/posts/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    submissionId,
                    nguoiDuyet: adminId,
                    action: "approve",
                    ghiChu: "Bài viết đạt yêu cầu",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const message = data.code 
                    ? `${data.message} - Mã code: ${data.code}` 
                    : data.message;
                success(message);
                fetchPendingPosts(); // Reload list
            } else {
                error(data.error || "Không thể duyệt bài");
            }
        } catch (err) {
            console.error("Error approving post:", err);
            error("Lỗi khi duyệt bài viết");
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (submissionId: number) => {
        const reason = prompt("Lý do từ chối:");
        if (!reason) return;

        setProcessing(submissionId);
        try {
            const response = await fetch("/api/admin/posts/approve", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    submissionId,
                    nguoiDuyet: adminId,
                    action: "reject",
                    ghiChu: reason,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                success(data.message || "Đã từ chối bài viết");
                fetchPendingPosts(); // Reload list
            } else {
                error(data.error || "Không thể từ chối bài");
            }
        } catch (err) {
            console.error("Error rejecting post:", err);
            error("Lỗi khi từ chối bài viết");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <Clock className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-muted-foreground">Đang tải...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-7xl p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Duyệt bài viết</h1>
                    <p className="text-muted-foreground">Quản lý và duyệt bài viết chờ phê duyệt</p>
                </div>
                <Link href="/" className="text-sm text-primary hover:underline">
                    ← Về trang chủ
                </Link>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Tổng số</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                        <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Bài Free</p>
                            <p className="text-2xl font-bold">{stats.free}</p>
                        </div>
                        <Eye className="w-8 h-8 text-green-500" />
                    </div>
                </div>
                <div className="bg-card border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Bài Premium</p>
                            <p className="text-2xl font-bold">{stats.premium}</p>
                        </div>
                        <User className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium">Lọc:</span>
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                >
                    Tất cả ({stats.total})
                </Button>
                <Button
                    variant={filter === 'free' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('free')}
                >
                    Free ({stats.free})
                </Button>
                <Button
                    variant={filter === 'premium' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('premium')}
                >
                    Premium ({stats.premium})
                </Button>
            </div>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Không có bài viết nào chờ duyệt</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className="bg-card border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">w-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                                            {post.nguoiDung.tenNguoiDung[0]}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold mb-1">{post.tieuDe}</h2>
                                            <p className="text-sm text-muted-foreground">
                                                <strong>{post.nguoiDung.tenNguoiDung}</strong> • {post.nguoiDung.email}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                <Clock className="w-3 h-3 inline mr-1" />
                                                {new Date(post.ngayGui).toLocaleString("vi-VN")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-shrink-0">className="flex-shrink-0">
                                    {post.isPremium ? (
                                        <span className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full text-xs font-bold shadow-md">
                                            ⭐ PREMIUM
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-xs font-semibold">
                                            FREE
                                        </span>
                                    )}
                                </div>
                            </div>

                            {post.hinhAnh && (
                                <div className="mb-4 rounded-lg overflow-hidden border">
                                    <img
                                        src={post.hinhAnh}
                                        alt={post.tieuDe}
                                        className="w-full max-h-96 object-cover"
                                    />
                                </div>
                            )}

                            <div className="mb-4 p-4 bg-muted/50 rounded-lg border">
                                <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.noiDung}</p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    onClick={() => handleApprove(post.id)}
                                    disabled={processing === post.id}
                                    className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    {processing === post.id ? "Đang xử lý..." : "Duyệt bài"}
                                </Button>
                                
                                <Button
                                    onClick={() => handleReject(post.id)}
                                    disabled={processing === post.id}
                                    variant="destructive"
                                    className="flex items-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Từ chối
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Toast notifications */}
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}
