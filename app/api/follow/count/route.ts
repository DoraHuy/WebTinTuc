import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Count followers for an author
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');

    if (!authorId) {
      return NextResponse.json({ error: 'Missing authorId' }, { status: 400 });
    }

    const count = await prisma.follow.count({
      where: { maNguoiDungTacGia: parseInt(authorId) },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error counting followers:', error);
    return NextResponse.json({ error: 'Failed to count followers' }, { status: 500 });
  }
}
