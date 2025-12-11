import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Check if user rated/liked a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const postId = searchParams.get('postId');

    if (!userId || !postId) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
    }

    const rating = await prisma.rating.findUnique({
      where: {
        maNguoiDung_maTinTuc: {
          maNguoiDung: parseInt(userId),
          maTinTuc: parseInt(postId),
        },
      },
    });

    // Get total rating count
    const totalRatings = await prisma.rating.count({
      where: { maTinTuc: parseInt(postId) },
    });

    return NextResponse.json({ 
      rated: !!rating,
      rating: rating?.rating || 0,
      totalRatings 
    });
  } catch (error) {
    console.error('Error checking rating:', error);
    return NextResponse.json({ error: 'Lỗi kiểm tra đánh giá' }, { status: 500 });
  }
}

// POST: Add or update rating/like
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, postId, rating = 1 } = body;

    if (!userId || !postId) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
    }

    const ratingData = await prisma.rating.upsert({
      where: {
        maNguoiDung_maTinTuc: {
          maNguoiDung: parseInt(userId),
          maTinTuc: parseInt(postId),
        },
      },
      create: {
        maNguoiDung: parseInt(userId),
        maTinTuc: parseInt(postId),
        rating: parseInt(rating),
      },
      update: {
        rating: parseInt(rating),
        ngayDanhGia: new Date(),
      },
    });

    return NextResponse.json({ 
      message: 'Đã đánh giá bài viết', 
      rating: ratingData 
    });
  } catch (error) {
    console.error('Error creating/updating rating:', error);
    return NextResponse.json({ error: 'Lỗi khi đánh giá' }, { status: 500 });
  }
}

// DELETE: Remove rating
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const postId = searchParams.get('postId');

    if (!userId || !postId) {
      return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 });
    }

    await prisma.rating.delete({
      where: {
        maNguoiDung_maTinTuc: {
          maNguoiDung: parseInt(userId),
          maTinTuc: parseInt(postId),
        },
      },
    });

    return NextResponse.json({ message: 'Đã bỏ đánh giá' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    return NextResponse.json({ error: 'Lỗi khi bỏ đánh giá' }, { status: 500 });
  }
}
