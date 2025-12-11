import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Get user's comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Thiếu thông tin userId' }, { status: 400 });
    }

    const comments = await prisma.binhLuans.findMany({
      where: {
        maNguoiDung: parseInt(userId),
      },
      include: {
        tinTuc: {
          select: {
            id: true,
            tenTinTuc: true,
          },
        },
      },
      orderBy: {
        ngayBinhLuan: 'desc',
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching user comments:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách bình luận' }, { status: 500 });
  }
}
