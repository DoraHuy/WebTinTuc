import { Post, Author, Category, Tag, TopAuthor, TrendingPost } from '@/lib/types/Homepage';
import { prisma } from '@/lib/prisma';

export async function getHomepageData() {
  const [posts, categories, tags, authors] = await Promise.all([
    prisma.tinTucs.findMany({
      include: {
        nguoiDung: true,
        danhMuc: true,
        tags: true,
      },
    }),
    prisma.danhMucs.findMany(),
    prisma.tags.findMany(),
    prisma.nguoiDungs.findMany(),
  ]);

  return { posts, categories, tags, authors };
}

export async function getPosts(options?: {
  limit?: number;
  offset?: number;
  categoryId?: number;
  isPremium?: boolean;
  sortBy?: 'latest' | 'trending' | 'popular';
}): Promise<Post[]> {
  const { limit, offset = 0, categoryId, isPremium, sortBy = 'latest' } = options || {};
  
  const where: any = {};
  
  if (categoryId) {
    where.danhMuc = {
      some: { id: categoryId }
    };
  }
  
  // Filter by isPremium if specified
  if (isPremium !== undefined) {
    where.isPremium = isPremium;
  }
  
  let orderBy: any = { ngayDang: 'desc' };
  if (sortBy === 'trending' || sortBy === 'popular') {
    orderBy = { thoiGianDang: 'desc' };
  }
  
  const posts = await prisma.tinTucs.findMany({
    where,
    orderBy,
    skip: offset,
    take: limit,
    include: {
      nguoiDung: true,
      danhMuc: true,
      tags: true,
    },
  });
  
  return posts as any;
}

export async function getFeaturedPost(): Promise<Post> {
  const posts = await getPosts({ sortBy: 'popular', limit: 1 });
  return posts[0];
}

export async function getLatestPosts(limit: number = 4): Promise<Post[]> {
  return getPosts({ limit, sortBy: 'latest' });
}

export async function getCategories(): Promise<Category[]> {
  return prisma.danhMucs.findMany({
    where: { parentId: null }
  }) as any;
}

export async function getTags(): Promise<Tag[]> {
  return prisma.tags.findMany() as any;
}

export async function getTopAuthors(type: 'posts' | 'interactions' | 'revenue', limit: number = 5): Promise<TopAuthor[]> {
  const authors = await prisma.nguoiDungs.findMany({
    include: {
      tinTuc: true,
    },
  });
  
  const authorsWithStats = authors.map((author, index) => ({
    id: author.id,
    tenNguoiDung: author.tenNguoiDung,
    email: author.email,
    rank: index + 1,
    stats: author.tinTuc.length,
  }));
  
  authorsWithStats.sort((a, b) => b.stats - a.stats);
  
  return authorsWithStats.slice(0, limit) as any;
}

export async function getTrendingPosts(limit: number = 5): Promise<TrendingPost[]> {
  const posts = await getPosts({ sortBy: 'trending', limit });
  
  return posts.map((post: any) => ({
    id: post.id,
    tenTinTuc: post.tenTinTuc,
    viewCount: 0,
    ngayDang: post.ngayDang,
    nguoiDung: {
      tenNguoiDung: post.nguoiDung.tenNguoiDung,
    },
    thumbnail: null,
  })) as any;
}

export async function getTotalPosts(filters?: {
  categoryId?: number;
  isPremium?: boolean;
}): Promise<number> {
  const where: any = {};
  
  if (filters?.categoryId) {
    where.danhMuc = {
      some: { id: filters.categoryId }
    };
  }
  
  // Filter by isPremium if specified
  if (filters?.isPremium !== undefined) {
    where.isPremium = filters.isPremium;
  }
  
  return prisma.tinTucs.count({ where });
}

export async function getPostById(id: number): Promise<Post | null> {
  const post = await prisma.tinTucs.findUnique({
    where: { id },
    include: {
      nguoiDung: true,
      danhMuc: true,
      tags: true,
    },
  });
  
  return post as any;
}
