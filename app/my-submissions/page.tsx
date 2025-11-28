'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Submission {
    id: number;
    tieuDe: string;
    trangThai: string;
    ngayGui: string;
    ghiChu?: string;
}

export default function MySubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = 1; // Tạm hardcode

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const response = await fetch(`/api/posts/submit?userId=${userId}`);
            const data = await response.json();
            
            if (response.ok) {
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Đang chờ duyệt</span>;
            case "approved":
                return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">✅ Đã duyệt</span>;
            case "rejected":
                return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">❌ Từ chối</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{status}</span>;
        }
    };

    if (loading) {
        return <div className="container mx-auto p-6">Đang tải...</div>;
    }

    return (
        <div className="container mx-auto max-w-6xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Bài viết đã gửi</h1>
                <div className="flex gap-2">
                <Link href="/posts/submit">
                    <Button className="bg-green-600 hover:bg-green-700">
                        + Đăng bài mới
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="outline">
                        🏠 Trang chủ
                    </Button>
                </Link>
                </div>
            </div>

            {submissions.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-4">Bạn chưa gửi bài viết nào</p>
                    <Link href="/posts/submit">
                        <Button className="bg-green-600 hover:bg-green-700">
                            Đăng bài ngay
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <div key={submission.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-semibold">{submission.tieuDe}</h3>
                                {getStatusBadge(submission.trangThai)}
                            </div>
                            
                            <p className="text-sm text-gray-500 mb-2">
                                Gửi lúc: {new Date(submission.ngayGui).toLocaleString("vi-VN")}
                            </p>

                            {submission.ghiChu && (
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                                    <p className="text-sm text-blue-900">
                                        <strong>Ghi chú:</strong> {submission.ghiChu}
                                    </p>
                                </div>
                            )}

                            {submission.trangThai === 'approved' && (
                                <div className="mt-3">
                                    <Link 
                                        href={`/my-posts/approved`}
                                        className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        📖 Xem bài đã duyệt
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
