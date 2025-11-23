'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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
    const adminId = 1; // Tạm hardcode

    useEffect(() => {
        fetchPendingPosts();
    }, []);

    const fetchPendingPosts = async () => {
        try {
            const response = await fetch("/api/admin/posts/approve");
            const data = await response.json();
            
            if (response.ok) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
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
                alert(`✅ ${data.message}\n🎁 Mã code: ${data.code}`);
                fetchPendingPosts(); // Reload list
            } else {
                alert("❌ " + data.error);
            }
        } catch (error) {
            console.error("Error approving post:", error);
            alert("❌ Lỗi khi duyệt bài viết");
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
                alert("✅ " + data.message);
                fetchPendingPosts(); // Reload list
            } else {
                alert("❌ " + data.error);
            }
        } catch (error) {
            console.error("Error rejecting post:", error);
            alert("❌ Lỗi khi từ chối bài viết");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return <div className="container mx-auto p-6">Đang tải...</div>;
    }

    return (
        <div className="container mx-auto max-w-7xl p-6">
            <h1 className="text-3xl font-bold mb-6">Duyệt bài viết</h1>

            {posts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">Không có bài viết nào chờ duyệt</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">{post.tieuDe}</h2>
                                    <p className="text-sm text-gray-600">
                                        Gửi bởi: <strong>{post.nguoiDung.tenNguoiDung}</strong> ({post.nguoiDung.email})
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Ngày gửi: {new Date(post.ngayGui).toLocaleString("vi-VN")}
                                    </p>
                                </div>
                                
                                <div>
                                    {post.isPremium ? (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                                            ⭐ Premium
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                                            Free
                                        </span>
                                    )}
                                </div>
                            </div>

                            {post.hinhAnh && (
                                <div className="mb-4">
                                    <img
                                        src={post.hinhAnh}
                                        alt={post.tieuDe}
                                        className="w-full max-h-64 object-cover rounded"
                                    />
                                </div>
                            )}

                            <div className="mb-4 p-4 bg-gray-50 rounded">
                                <p className="whitespace-pre-wrap">{post.noiDung}</p>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => handleApprove(post.id)}
                                    disabled={processing === post.id}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {processing === post.id ? "Đang xử lý..." : "✅ Duyệt bài"}
                                </Button>
                                
                                <Button
                                    onClick={() => handleReject(post.id)}
                                    disabled={processing === post.id}
                                    variant="destructive"
                                >
                                    ❌ Từ chối
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
