import { updatePost } from '@/lib/actions/post';
import { getCategories, getPostById } from '@/lib/data/homepage-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { ChevronLeft, Save, FileEdit } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const postId = parseInt(id);

    // Lấy dữ liệu bài viết cũ từ DB để điền vào form (Pre-fill)
    const [post, categories] = await Promise.all([
        getPostById(postId),
        getCategories()
    ]);

    if (!post) return notFound();

    // Bind ID vào server action để khi submit sẽ gửi kèm ID bài viết
    // Ép kiểu để TypeScript hiểu đây là `(formData: FormData) => Promise<void>`
    const updatePostWithId = updatePost.bind(null, postId) as unknown as (formData: FormData) => Promise<void>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/TacGia/Posts">
                        <Button variant="outline" size="icon" className="rounded-full">
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <FileEdit className="w-6 h-6 text-primary" />
                            Chỉnh sửa bài viết
                        </h1>
                        <p className="text-sm text-muted-foreground">Cập nhật nội dung cho bài viết #{post.id}</p>
                    </div>
                </div>

                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <form action={updatePostWithId} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="tenTinTuc">Tiêu đề bài viết</Label>
                            <Input id="tenTinTuc" name="tenTinTuc" defaultValue={post.tenTinTuc} required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="danhMucId">Danh mục</Label>
                                <select
                                    id="danhMucId"
                                    name="danhMucId"
                                    defaultValue={post.danhMuc[0]?.id}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.tenDanhMuc}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">Link ảnh bìa (URL)</Label>
                                <Input id="thumbnail" name="thumbnail" defaultValue={post.thumbnail || ''} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tomTat">Tóm tắt ngắn</Label>
                            <textarea
                                id="tomTat"
                                name="tomTat"
                                rows={3}
                                defaultValue={post.tomTat}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm border-gray-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="noiDungTinTuc">Nội dung chi tiết</Label>
                            <textarea
                                id="noiDungTinTuc"
                                name="noiDungTinTuc"
                                rows={15}
                                defaultValue={post.noiDungTinTuc}
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono border-gray-200"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-4 border-t mt-8">
                            <Link href="/TacGia/Posts">
                                <Button variant="ghost" type="button">Hủy bỏ</Button>
                            </Link>
                            <Button type="submit" className="bg-primary min-w-[150px]">
                                <Save className="w-4 h-4 mr-2" />
                                Cập nhật
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}