// app/TacGia/Posts/create/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    ChevronLeft,
    Save,
    Loader2,
    Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createPost } from '@/lib/actions/post'; // Server Action
import { getCategories } from '@/lib/data/homepage-data'; // Lấy danh mục

// 1. Schema Validation (Đồng bộ với Backend)
const formSchema = z.object({
    tenTinTuc: z.string().min(5, "Tiêu đề quá ngắn (tối thiểu 5 ký tự)"),
    danhMucId: z.string().min(1, "Vui lòng chọn danh mục"),
    thumbnail: z.string().url("Link ảnh không hợp lệ").optional().or(z.literal('')),
    tomTat: z.string().optional(),
    noiDungTinTuc: z.string().min(20, "Nội dung quá ngắn (tối thiểu 20 ký tự)"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePostPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<{ id: number; tenDanhMuc: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 2. Setup Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tenTinTuc: '',
            danhMucId: '',
            thumbnail: '',
            tomTat: '',
            noiDungTinTuc: '',
        },
    });

    // Watch để preview ảnh thumbnail
    const thumbnailValue = watch('thumbnail');

    // 3. Fetch Danh mục (Client-side fetching vì đây là Client Component)
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch (error) {
                console.error('Lỗi lấy danh mục:', error);
            }
        };
        fetchCats();
    }, []);

    // 4. Xử lý Submit
    const onSubmit = async (data: FormValues) => {
        setIsLoading(true);
        try {
            // Tạo FormData để gửi lên Server Action
            const formData = new FormData();
            formData.append('tenTinTuc', data.tenTinTuc);
            formData.append('danhMucId', data.danhMucId);
            formData.append('tomTat', data.tomTat || '');
            formData.append('noiDungTinTuc', data.noiDungTinTuc);
            formData.append('thumbnail', data.thumbnail || '');
            formData.append('authorId', '1'); // TODO: Thay bằng ID thật từ session

            const result = await createPost(formData);

            if (result?.message) {
                alert(result.message); // Hiển thị lỗi từ server trả về
            } else {
                // Thành công -> Redirect (Server Action đã làm rồi, nhưng thêm router.push cho chắc chắn)
                // router.push('/TacGia/Posts'); 
            }
        } catch (error) {
            console.error(error);
            alert('Đã có lỗi xảy ra khi tạo bài viết.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="max-w-5xl mx-auto">

                {/* --- Header --- */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/TacGia/Posts">
                            <Button variant="outline" size="icon" className="rounded-full shadow-sm bg-white hover:bg-gray-100">
                                <ChevronLeft className="w-5 h-5 text-gray-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Viết bài mới</h1>
                            <p className="text-sm text-muted-foreground">Chia sẻ kiến thức công nghệ</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Link href="/TacGia/Posts">
                            <Button variant="ghost">Hủy bỏ</Button>
                        </Link>
                        <Button
                            onClick={handleSubmit(onSubmit)}
                            disabled={isLoading}
                            className="bg-primary min-w-[140px]"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang lưu...</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> Lưu bài viết</>
                            )}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Cột Chính --- */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Card: Thông tin cơ bản */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                            <h3 className="font-semibold text-gray-800 border-b pb-2">Thông tin bài viết</h3>

                            <div className="space-y-2">
                                <Label htmlFor="tenTinTuc">Tiêu đề <span className="text-red-500">*</span></Label>
                                <Input
                                    id="tenTinTuc"
                                    {...register('tenTinTuc')}
                                    placeholder="Nhập tiêu đề bài viết..."
                                    className="text-lg font-medium"
                                />
                                {errors.tenTinTuc && <p className="text-xs text-red-500">{errors.tenTinTuc.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tomTat">Tóm tắt ngắn</Label>
                                <textarea
                                    id="tomTat"
                                    {...register('tomTat')}
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                    placeholder="Mô tả ngắn gọn..."
                                />
                            </div>
                        </div>

                        {/* Card: Nội dung */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
                            <h3 className="font-semibold text-gray-800 border-b pb-2">Nội dung chi tiết</h3>
                            <div className="space-y-2">
                                <textarea
                                    id="noiDungTinTuc"
                                    {...register('noiDungTinTuc')}
                                    rows={15}
                                    className="flex w-full rounded-md border border-input bg-gray-50/50 px-4 py-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-primary font-mono leading-relaxed"
                                    placeholder="Viết nội dung bài viết tại đây..."
                                />
                                {errors.noiDungTinTuc && <p className="text-xs text-red-500">{errors.noiDungTinTuc.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* --- Cột Phụ (Cài đặt) --- */}
                    <div className="lg:col-span-1 space-y-6">

                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4 sticky top-6">
                            <h3 className="font-semibold text-gray-800 border-b pb-2">Cài đặt</h3>

                            {/* Danh mục */}
                            <div className="space-y-2">
                                <Label htmlFor="danhMucId">Danh mục <span className="text-red-500">*</span></Label>
                                <select
                                    id="danhMucId"
                                    {...register('danhMucId')}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.tenDanhMuc}</option>
                                    ))}
                                </select>
                                {errors.danhMucId && <p className="text-xs text-red-500">{errors.danhMucId.message}</p>}
                            </div>

                            {/* Thumbnail */}
                            <div className="space-y-3 pt-2">
                                <Label className="flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-gray-500" /> Ảnh đại diện
                                </Label>

                                {/* Preview Image */}
                                <div className="aspect-video w-full rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center overflow-hidden relative">
                                    {thumbnailValue ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={thumbnailValue}
                                            alt="Thumbnail Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                        />
                                    ) : (
                                        <div className="text-center p-4 text-gray-400">
                                            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-xs">Chưa có ảnh</p>
                                        </div>
                                    )}
                                </div>

                                <Input
                                    id="thumbnail"
                                    {...register('thumbnail')}
                                    placeholder="Dán link ảnh (https://...)"
                                    className="text-sm"
                                />
                                {errors.thumbnail && <p className="text-xs text-red-500">{errors.thumbnail.message}</p>}
                            </div>
                        </div>

                        {/* Helper Box */}
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-blue-800 text-xs space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Lưu ý
                            </h4>
                            <ul className="list-disc list-inside space-y-1 opacity-80 pl-1">
                                <li>Tiêu đề ngắn gọn, súc tích.</li>
                                <li>Nội dung không vi phạm bản quyền.</li>
                                <li>Bài viết sẽ ở trạng thái <b>Chờ duyệt</b>.</li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}