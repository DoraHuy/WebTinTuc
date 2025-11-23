'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

interface ApprovedPost {
    id: number;
    tieuDe: string;
    noiDung: string;
    isPremium: boolean;
    ngayGui: string;
    ngayDuyet: string;
    ghiChu?: string;
}

export default function ApprovedPostsPage() {
    const [posts, setPosts] = useState<ApprovedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = 1; // Tạm hardcode

    useEffect(() => {
        fetchApprovedPosts();
    }, []);

    const fetchApprovedPosts = async () => {
        try {
            const response = await fetch(`/api/posts/submit?userId=${userId}`);
            const data = await response.json();
            
            if (response.ok) {
                const approved = data.submissions.filter((s: any) => s.trangThai === 'approved');
                setPosts(approved);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="container mx-auto p-6">Đang tải...</div>;
    }

    return (
        <div className="container mx-auto max-w-6xl p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Bài viết đã duyệt</h1>
                    <p className="text-muted-foreground">
                        Các bài viết của bạn đã được admin phê duyệt và có thể đọc tự do
                    </p>
                </div>
                <Link href="/my-submissions">
                    <Button variant="outline">
                        ← Quay lại
                    </Button>
                </Link>
            </div>

            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                    💡 <strong>Lưu ý:</strong> Tất cả bài viết đã duyệt (FREE hoặc PREMIUM) của bạn đều có thể đọc không giới hạn. 
                    Bài FREE sẽ nhận được mã code để đọc các bài premium khác!
                </p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Bạn chưa có bài viết nào được duyệt
                    </p>
                    <Link href="/posts/submit">
                        <Button className="bg-green-600 hover:bg-green-700">
                            Đăng bài ngay
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {posts.map((post) => (
                        <div 
                            key={post.id} 
                            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            <div className={`h-2 ${post.isPremium ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'}`} />
                            
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-xl font-bold flex-1 mr-4">
                                        {post.tieuDe}
                                    </h3>
                                    {post.isPremium ? (
                                        <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-semibold whitespace-nowrap">
                                            <Crown className="w-3 h-3" />
                                            PREMIUM
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-semibold whitespace-nowrap">
                                            FREE
                                        </span>
                                    )}
                                </div>

                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                    {post.noiDung.substring(0, 150)}...
                                </p>

                                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                                    <div className="flex justify-between">
                                        <span>Ngày gửi:</span>
                                        <span className="font-medium">
                                            {new Date(post.ngayGui).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Ngày duyệt:</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">
                                            {new Date(post.ngayDuyet).toLocaleDateString("vi-VN")}
                                        </span>
                                    </div>
                                </div>

                                {post.ghiChu && (
                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded border-l-4 border-primary">
                                        <p className="text-xs text-muted-foreground">
                                            <strong>Admin:</strong> {post.ghiChu}
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <div className="flex-1 px-3 py-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded text-xs text-center">
                                        <span className="font-semibold text-green-700 dark:text-green-300">
                                            ✅ Đọc được tự do
                                        </span>
                                    </div>
                                    
                                    {!post.isPremium && (
                                        <div className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded text-xs text-center">
                                            <span className="font-semibold text-blue-700 dark:text-blue-300">
                                                🎁 Nhận mã code
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
