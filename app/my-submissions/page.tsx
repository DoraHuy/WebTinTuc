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
    isPremium: boolean;
    redeemCode?: {
        code: string;
        loaiCode: string;
    };
}

export default function MySubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchSubmissions();
        }
    }, [userId]);

    const fetchUserId = async () => {
        try {
            const response = await fetch("/api/auth/me");
            const data = await response.json();
            
            console.log("🔍 Auth response:", data);
            console.log("📝 userId:", data.user?.userId);
            
            if (response.ok && data.authenticated && data.user && data.user.userId) {
                const uid = data.user.userId;
                console.log("✅ Setting userId:", uid);
                setUserId(uid);
                
                // Fetch submissions with this userId
                const subsResponse = await fetch(`/api/posts/submit?userId=${uid}`);
                const subsData = await subsResponse.json();
                console.log("📦 Submissions response:", subsData);
                
                setLoading(false);
            } else {
                console.log("❌ Not authenticated");
                setError("Vui lòng đăng nhập để xem bài viết của bạn");
                setLoading(false);
            }
        } catch (error) {
            console.error("💥 Error fetching user:", error);
            setError("Có lỗi xảy ra khi kiểm tra đăng nhập");
            setLoading(false);
        }
    };

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

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
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

    if (error) {
        return (
            <div className="container mx-auto max-w-6xl p-6">
                <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 mb-4 text-lg">{error}</p>
                    <Link href="/login">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Đăng nhập ngay
                        </Button>
                    </Link>
                </div>
            </div>
        );
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

                            {submission.trangThai === 'approved' && submission.redeemCode && (
                                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border-2 border-green-200 dark:border-green-700">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                                            🎁 MÃ MỞ BÀI VIẾT
                                        </span>
                                        <span className="text-xs text-green-600 dark:text-green-400">
                                            Dùng 1 lần
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 rounded border border-green-300 dark:border-green-600 font-mono text-sm font-bold text-green-900 dark:text-green-200">
                                            {submission.redeemCode.code}
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard(submission.redeemCode!.code)}
                                            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-xs font-medium whitespace-nowrap"
                                        >
                                            {copiedCode === submission.redeemCode.code ? "✓ Đã copy" : "📋 Copy"}
                                        </button>
                                    </div>
                                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                                        💡 Dùng mã này tại <Link href="/manage/redeem" className="underline font-semibold">trang redeem</Link> để mở bài viết này
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
