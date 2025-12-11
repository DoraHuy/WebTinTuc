import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);

    const comment = await prisma.binhLuans.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { error: 'Bình luận không tồn tại' },
        { status: 404 }
      );
    }

    await prisma.binhLuans.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Xóa bình luận thành công' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa bình luận' },
      { status: 500 }
    );
  }
}
