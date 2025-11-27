'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

// 1. Schema kiểm tra dữ liệu đầu vào (Validation)
const CreatePostSchema = z.object({
  tenTinTuc: z.string().min(5, "Tiêu đề quá ngắn (tối thiểu 5 ký tự)"),
  tomTat: z.string().optional(),
  noiDungTinTuc: z.string().min(20, "Nội dung quá ngắn (tối thiểu 20 ký tự)"),
  thumbnail: z.string().optional().or(z.literal('')),
  danhMucId: z.coerce.number().min(1, "Vui lòng chọn danh mục"),
  authorId: z.coerce.number(),
});

// 2. Hàm Tạo bài viết (CREATE)
export async function createPost(formData: FormData) {
  const rawData = {
    tenTinTuc: formData.get('tenTinTuc'),
    tomTat: formData.get('tomTat'),
    noiDungTinTuc: formData.get('noiDungTinTuc'),
    thumbnail: formData.get('thumbnail'),
    danhMucId: formData.get('danhMucId'),
    authorId: formData.get('authorId'),
  };

  const validatedFields = CreatePostSchema.safeParse(rawData);

  if (!validatedFields.success) {
    console.error("Lỗi Validation:", validatedFields.error.flatten().fieldErrors);
    return { message: 'Dữ liệu không hợp lệ.' };
  }

  const { tenTinTuc, tomTat, noiDungTinTuc, thumbnail, danhMucId, authorId } = validatedFields.data;

  try {
    await prisma.tinTucs.create({
      data: {
        tenTinTuc,
        tomTat,
        noiDungTinTuc,
        thumbnail: thumbnail || null,
        trangThaiDuyet: false, // Mặc định là Chờ duyệt
        maNguoiDung: authorId,
        danhMuc: { connect: { id: danhMucId } }
      },
    });
  } catch (error) {
    console.error('Lỗi Database:', error);
    return { message: 'Lỗi hệ thống.' };
  }

  revalidatePath('/TacGia/Posts');
  redirect('/TacGia/Posts');
}

// 3. Hàm Cập nhật bài viết (UPDATE)
export async function updatePost(id: number, formData: FormData) {
  const rawData = {
    tenTinTuc: formData.get('tenTinTuc'),
    tomTat: formData.get('tomTat'),
    noiDungTinTuc: formData.get('noiDungTinTuc'),
    thumbnail: formData.get('thumbnail'),
    danhMucId: formData.get('danhMucId'),
  };

  // Dùng lại schema cũ nhưng thêm authorId giả để pass validation (vì update ko cần đổi tác giả)
  const validatedFields = CreatePostSchema.safeParse({ ...rawData, authorId: 1 });

  if (!validatedFields.success) {
    console.error('Lỗi Validation:', validatedFields.error.flatten().fieldErrors);
    return;
  }

  const { tenTinTuc, tomTat, noiDungTinTuc, thumbnail, danhMucId } = validatedFields.data;

  try {
    await prisma.tinTucs.update({
      where: { id },
      data: {
        tenTinTuc,
        tomTat,
        noiDungTinTuc,
        thumbnail: thumbnail || null,
        // Khi sửa bài, có thể bạn muốn reset trạng thái về "Chờ duyệt"
        // trangThaiDuyet: false, 
        danhMuc: {
          set: [],               // Xóa danh mục cũ
          connect: { id: danhMucId } // Nối danh mục mới
        }
      },
    });
  } catch (error) {
    console.error('Lỗi Database:', error);
    return;
  }

  revalidatePath('/TacGia/Posts');
  redirect('/TacGia/Posts');
}

// 4. Hàm Xóa bài viết (DELETE)
export async function deletePost(id: number) {
  try {
    await prisma.tinTucs.delete({ where: { id } });
  } catch (error) {
    console.error('Lỗi khi xóa:', error);
    return { message: 'Không thể xóa bài viết.' };
  }
  revalidatePath('/TacGia/Posts');
}

// 5. Hàm Đăng bài (PUBLISH)
export async function publishPost(id: number) {
  try {
    await prisma.tinTucs.update({
      where: { id },
      data: {
        trangThaiDuyet: true, // Duyệt bài
        ngayDang: new Date(), // Cập nhật ngày đăng mới nhất
      },
    });
  } catch (error) {
    console.error('Lỗi khi đăng bài:', error);
    return { message: 'Lỗi hệ thống.' };
  }
  revalidatePath('/TacGia/Posts');
  revalidatePath('/'); // Cập nhật trang chủ
}

// Wrapper server action để dùng trực tiếp làm form action (lấy `id` từ FormData)
export async function updatePostAction(formData: FormData) {
  const idRaw = formData.get('id');
  const id = typeof idRaw === 'string' || typeof idRaw === 'number' ? Number(idRaw) : NaN;
  if (Number.isNaN(id)) {
    console.error('updatePostAction: id không hợp lệ', idRaw);
    return { message: 'ID bài viết không hợp lệ.' };
  }
  return updatePost(id, formData);
}