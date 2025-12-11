import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ posts: [] });
    }

    // Tìm kiếm gần đúng trong tiêu đề và nội dung
    const posts = await prisma.tinTucs.findMany({
      where: {
        OR: [
          {
            tenTinTuc: {
              contains: query,
            },
          },
          {
            noiDungTinTuc: {
              contains: query,
            },
          },
          {
            tomTat: {
              contains: query,
            },
          },
        ],
        trangThaiDuyet: true,
      },
      select: {
        id: true,
        tenTinTuc: true,
        tomTat: true,
        isPremium: true,
        thoiGianDang: true,
        nguoiDung: {
          select: {
            id: true,
            tenNguoiDung: true,
          },
        },
        bookmarks: {
          select: {
            id: true,
          },
        },
        binhLuan: {
          select: {
            id: true,
          },
        },
      },
      take: 8,
      orderBy: {
        thoiGianDang: 'desc',
      },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      tenTinTuc: post.tenTinTuc,
      moTa: post.tomTat || '',
      hinhAnh: '/placeholder.jpg',
      isPremium: post.isPremium,
      thoiGianDang: post.thoiGianDang,
      nguoiDung: post.nguoiDung
        ? {
            id: post.nguoiDung.id,
            tenNguoiDung: post.nguoiDung.tenNguoiDung,
          }
        : null,
      bookmarks: post.bookmarks.length,
      binhLuan: post.binhLuan.length,
    }));

    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}
