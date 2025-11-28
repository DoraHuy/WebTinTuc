'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SubmitPostPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        tieuDe: "",
        noiDung: "",
        hinhAnh: "",
        isPremium: false,
        maNguoiDung: 1, // Tạm thời hardcode, sau này lấy từ session
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/posts/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ " + data.message);
                router.push("/my-submissions");
            } else {
                alert("❌ " + data.error);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("❌ Lỗi khi gửi bài viết");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto max-w-4xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Đăng bài để đọc</h1>
                <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Trang chủ
                </Link>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                    📝 <strong>Hướng dẫn:</strong> Gửi bài viết của bạn để đọc các bài premium.
                    Sau khi admin duyệt, bạn sẽ nhận được mã code để đọc bài premium miễn phí!
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <Label htmlFor="tieuDe">Tiêu đề *</Label>
                    <Input
                        id="tieuDe"
                        type="text"
                        required
                        value={formData.tieuDe}
                        onChange={(e) => setFormData({ ...formData, tieuDe: e.target.value })}
                        placeholder="Nhập tiêu đề bài viết"
                        className="mt-2"
                    />
                </div>

                <div>
                    <Label htmlFor="noiDung">Nội dung *</Label>
                    <textarea
                        id="noiDung"
                        required
                        value={formData.noiDung}
                        onChange={(e) => setFormData({ ...formData, noiDung: e.target.value })}
                        placeholder="Nhập nội dung bài viết"
                        className="mt-2 w-full min-h-[200px] p-3 border rounded-md"
                    />
                </div>

                <div>
                    <Label htmlFor="hinhAnh">Đường dẫn hình ảnh (tùy chọn)</Label>
                    <Input
                        id="hinhAnh"
                        type="text"
                        value={formData.hinhAnh}
                        onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                        placeholder="/images/my-image.jpg"
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isPremium"
                        checked={formData.isPremium}
                        onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                        className="w-4 h-4"
                    />
                    <Label htmlFor="isPremium" className="cursor-pointer">
                        Đánh dấu là bài Premium (nếu bạn muốn chia sẻ bài premium)
                    </Label>
                </div>

                <div className="flex gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {loading ? "Đang gửi..." : "Gửi bài viết"}
                    </Button>
                    
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Hủy
                    </Button>
                </div>
            </form>
        </div>
    );
}
