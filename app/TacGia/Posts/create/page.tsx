// app/TacGia/Posts/create/page.tsx
import { createPost } from '@/lib/actions/post';
import { getCategories } from '@/lib/data/homepage-data'; // Tận dụng hàm lấy danh mục có sẵn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';

export default async function CreatePostPage() {
    // Lấy danh mục để hiển thị trong dropdown
    const categories = await getCategories();

    // GIẢ LẬP ID TÁC GIẢ ĐANG ĐĂNG NHẬP (Để test)
    // Sau này bạn sẽ thay bằng session.user.id
    const CURRENT_USER_ID = 1;

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/TacGia/Posts">
                    <Button variant="outline" size="icon">
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Viết bài mới</h1>
            </div>

            {/* Form */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
                <form action={createPost} className="space-y-6">

                    {/* Hidden input chứa ID tác giả */}
                    <input type="hidden" name="authorId" value={CURRENT_USER_ID} />

                    {/* Tiêu đề */}
                    <div className="space-y-2">
                        <Label htmlFor="tenTinTuc">Tiêu đề bài viết</Label>
                        <Input
                            id="tenTinTuc"
                            name="tenTinTuc"
                            placeholder="Nhập tiêu đề hấp dẫn..."
                            required
                        />
                    </div>

                    {/* Danh mục & Thumbnail */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="danhMucId">Danh mục</Label>
                            <select
                                id="danhMucId"
                                name="danhMucId"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.tenDanhMuc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="thumbnail">Link ảnh thumbnail (URL)</Label>
                            <Input
                                id="thumbnail"
                                name="thumbnail"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                    </div>

                    {/* Tóm tắt */}
                    <div className="space-y-2">
                        <Label htmlFor="tomTat">Tóm tắt ngắn</Label>
                        <textarea
                            id="tomTat"
                            name="tomTat"
                            rows={3}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Mô tả ngắn gọn về nội dung bài viết..."
                        />
                    </div>

                    {/* Nội dung chính */}
                    <div className="space-y-2">
                        <Label htmlFor="noiDungTinTuc">Nội dung chi tiết (HTML/Text)</Label>
                        <textarea
                            id="noiDungTinTuc"
                            name="noiDungTinTuc"
                            rows={15}
                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            placeholder="Viết nội dung bài báo ở đây..."
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            *Tạm thời dùng Textarea thường. Sau này có thể nâng cấp lên Rich Text Editor.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <Link href="/TacGia/Posts">
                            <Button variant="ghost" type="button">Hủy bỏ</Button>
                        </Link>
                        <Button type="submit" className="bg-primary">
                            <Save className="w-4 h-4 mr-2" />
                            Lưu bài viết
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}