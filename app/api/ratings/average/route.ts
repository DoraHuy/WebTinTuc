import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET average rating for a post
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    const ratings = await prisma.rating.findMany({
      where: { maTinTuc: parseInt(postId) },
      select: { rating: true },
    });

    const count = ratings.length;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = count > 0 ? sum / count : 0;

    return NextResponse.json({ average, count });
  } catch (error) {
    console.error('Error fetching average rating:', error);
    return NextResponse.json({ error: 'Failed to fetch rating' }, { status: 500 });
  }
}
