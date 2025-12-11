import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const comments = await prisma.binhLuans.findMany({
      select: {
        id: true,
        noiDungBinhLuan: true,
        ngayBinhLuan: true,
        maNguoiDung: true,
        maTinTuc: true,
        tenNguoiBinhLuan: true,
        trangThaiAnDanh: true,
        nguoiDung: {
          select: {
            tenNguoiDung: true,
            email: true,
          },
        },
        tinTuc: {
          select: {
            tenTinTuc: true,
          },
        },
      },
      orderBy: {
        ngayBinhLuan: 'desc',
      },
    });

    const formattedComments = comments.map(c => ({
      id: c.id,
      noiDungBinhLuan: c.noiDungBinhLuan,
      thoiGianBinhLuan: c.ngayBinhLuan,
      tenNguoiDung: c.tenNguoiBinhLuan || c.nguoiDung?.tenNguoiDung || 'Ẩn danh',
      email: c.nguoiDung?.email || 'N/A',
      tenTinTuc: c.tinTuc?.tenTinTuc || 'Bài viết không tồn tại',
    }));

    return NextResponse.json({ comments: formattedComments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách bình luận' },
      { status: 500 }
    );
  }
}
