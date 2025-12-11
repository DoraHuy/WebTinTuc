import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Follow/unfollow author
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, authorId } = body;

    if (!userId || !authorId) {
      return NextResponse.json({ error: 'Missing userId or authorId' }, { status: 400 });
    }

    if (userId === authorId) {
      return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });
    }

    // Check if already following
    const existing = await prisma.follow.findUnique({
      where: {
        maNguoiDungTheoDoi_maNguoiDungTacGia: {
          maNguoiDungTheoDoi: parseInt(userId),
          maNguoiDungTacGia: parseInt(authorId),
        },
      },
    });

    if (existing) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          maNguoiDungTheoDoi_maNguoiDungTacGia: {
            maNguoiDungTheoDoi: parseInt(userId),
            maNguoiDungTacGia: parseInt(authorId),
          },
        },
      });
      return NextResponse.json({ message: 'Unfollowed', isFollowing: false });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          maNguoiDungTheoDoi: parseInt(userId),
          maNguoiDungTacGia: parseInt(authorId),
        },
      });
      return NextResponse.json({ message: 'Followed', isFollowing: true });
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    return NextResponse.json({ error: 'Failed to toggle follow' }, { status: 500 });
  }
}

// GET: Check if user follows author
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const authorId = searchParams.get('authorId');

    if (!userId || !authorId) {
      return NextResponse.json({ error: 'Missing userId or authorId' }, { status: 400 });
    }

    const follow = await prisma.follow.findUnique({
      where: {
        maNguoiDungTheoDoi_maNguoiDungTacGia: {
          maNguoiDungTheoDoi: parseInt(userId),
          maNguoiDungTacGia: parseInt(authorId),
        },
      },
    });

    return NextResponse.json({ isFollowing: !!follow });
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json({ error: 'Failed to check follow status' }, { status: 500 });
  }
}
