import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Check if user bookmarked a post OR list all bookmarks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const postId = searchParams.get('postId');

    if (!userId) {
      return NextResponse.json({ error: 'Thiếu thông tin userId' }, { status: 400 });
    }

    // If postId is provided, check if that specific post is bookmarked
    if (postId) {
      const bookmark = await prisma.bookmark.findUnique({
        where: {
          maNguoiDung_maTinTuc: {
            maNguoiDung: parseInt(userId),
            maTinTuc: parseInt(postId),
          },
        },
      });
      return NextResponse.json({ bookmarked: !!bookmark });
    }

    // Otherwise, list all bookmarks for the user
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        maNguoiDung: parseInt(userId),
      },
      include: {
        tinTuc: {
          include: {
            nguoiDung: {
              select: {
                tenNguoiDung: true,
              },
            },
          },
        },
      },
      orderBy: {
        ngayLuu: 'desc',
      },
    });

    return NextResponse.json({ bookmarks });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ error: 'Lỗi khi lấy danh sách bookmark' }, { status: 500 });
  }
}

// POST: Add bookmark
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, postId } = body;

    if (!userId || !postId) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        maNguoiDung: parseInt(userId),
        maTinTuc: parseInt(postId),
      },
    });

    return NextResponse.json({ 
      message: 'Đã lưu bài viết', 
      bookmark 
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Bài viết đã được lưu trước đó' }, { status: 400 });
    }
    console.error('Error creating bookmark:', error);
    return NextResponse.json({ error: 'Lỗi khi lưu bài viết' }, { status: 500 });
  }
}

// DELETE: Remove bookmark
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const postId = searchParams.get('postId');

    if (!userId || !postId) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
    }

    await prisma.bookmark.delete({
      where: {
        maNguoiDung_maTinTuc: {
          maNguoiDung: parseInt(userId),
          maTinTuc: parseInt(postId),
        },
      },
    });

    return NextResponse.json({ message: 'Đã bỏ lưu bài viết' });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json({ error: 'Lỗi khi bỏ lưu' }, { status: 500 });
  }
}
