import { prisma } from '@/lib/prisma';

// Helper: safely run a prisma call and return fallback when DB is unavailable
async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      const raw = (e as Error)?.message || String(e);
      // Ẩn port (vd: `localhost`:`3306`) khỏi log để gọn gàng
      const sanitized = raw
        .replace(/`localhost`:`\d+`/g, '`localhost`')
        .replace(/:\d+/g, '');
      console.warn('[DB Dự phòng]', sanitized);
    }
    return fallback;
  }
}

export async function getPosts(options?: {
  limit?: number;
  offset?: number;
  categoryId?: number;
  sortBy?: 'latest' | 'trending' | 'popular';
}): Promise<any[]> {
  const { limit, offset = 0, categoryId, sortBy = 'latest' } = options || {};
  
  const where: any = {
    trangThaiDuyet: true
  };
  
  if (categoryId) {
    where.danhMuc = {
      some: { id: categoryId }
    };
  }
  
  let orderBy: any = { ngayDang: 'desc' };
  
  const posts = await safe(
    prisma.tinTucs.findMany({
    where,
    orderBy,
    skip: offset,
    take: limit,
    include: {
      nguoiDung: true,
      danhMuc: true,
      tags: true,
    },
    }),
    []
  );
  
  return posts.map(post => ({
    id: post.id,
    tenTinTuc: post.tenTinTuc,
    tomTat: post.tomTat,
    noiDungTinTuc: post.noiDungTinTuc,
    ngayDang: post.ngayDang,
    isPremium: post.isPremium || false,
    gia: post.gia || 0,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    nguoiDung: {
      id: post.nguoiDung.id,
      tenNguoiDung: post.nguoiDung.tenNguoiDung,
      email: post.nguoiDung.email,
    },
    danhMuc: post.danhMuc.map(dm => ({
      id: dm.id,
      tenDanhMuc: dm.tenDanhMuc,
      moTaDanhMuc: dm.moTaDanhMuc,
    })),
    tags: post.tags.map(tag => ({
      id: tag.id,
      tenTag: tag.tenTag,
    })),
    thumbnail: null,
  }));
}

export async function getFeaturedPost(): Promise<any> {
  const posts = await getPosts({ limit: 1 });
  return posts[0] || null;
}

export async function getLatestPosts(limit: number = 4): Promise<any[]> {
  return getPosts({ limit, sortBy: 'latest' });
}

export async function getCategories(): Promise<any[]> {
  const categories = await safe(
    prisma.danhMucs.findMany({
    where: { parentId: null }
    }),
    []
  );
  
  return categories.map(cat => ({
    id: cat.id,
    tenDanhMuc: cat.tenDanhMuc,
    moTaDanhMuc: cat.moTaDanhMuc,
  }));
}

export async function getTags(): Promise<any[]> {
  const tags = await safe(prisma.tags.findMany(), [] as any[]);
  return tags.map(tag => ({
    id: tag.id,
    tenTag: tag.tenTag,
  }));
}

export async function getTopAuthors(type: 'posts' | 'interactions' | 'revenue', limit: number = 5): Promise<any[]> {
  const authors = await safe(
    prisma.nguoiDungs.findMany({
    include: {
      tinTuc: {
        where: { trangThaiDuyet: true }
      },
    },
    }),
    []
  );
  
  const authorsWithStats = authors.map((author, index) => ({
    id: author.id,
    tenNguoiDung: author.tenNguoiDung,
    email: author.email,
    rank: index + 1,
    stats: author.tinTuc.length,
  }));
  
  authorsWithStats.sort((a, b) => b.stats - a.stats);
  
  return authorsWithStats.slice(0, limit);
}

export async function getTrendingPosts(limit: number = 5): Promise<any[]> {
  const posts = await getPosts({ sortBy: 'latest', limit });
  
  return posts.map((post: any) => ({
    id: post.id,
    tenTinTuc: post.tenTinTuc,
    viewCount: 0,
    ngayDang: post.ngayDang,
    nguoiDung: {
      tenNguoiDung: post.nguoiDung.tenNguoiDung,
    },
    thumbnail: null,
  }));
}

export async function getTotalPosts(filters?: {
  categoryId?: number;
}): Promise<number> {
  const where: any = {
    trangThaiDuyet: true
  };
  
  if (filters?.categoryId) {
    where.danhMuc = {
      some: { id: filters.categoryId }
    };
  }
  
  return await safe(prisma.tinTucs.count({ where }), 0);
}

export async function getPostById(id: number): Promise<any | null> {
  const post = await safe(
    prisma.tinTucs.findUnique({
    where: { id },
    include: {
      nguoiDung: true,
      danhMuc: true,
      tags: true,
    },
    }),
    null
  );
  
  if (!post) return null;
  
  return {
    id: post.id,
    tenTinTuc: post.tenTinTuc,
    tomTat: post.tomTat,
    noiDungTinTuc: post.noiDungTinTuc,
    ngayDang: post.ngayDang,
    isPremium: post.isPremium || false,
    gia: post.gia || 0,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    nguoiDung: {
      id: post.nguoiDung.id,
      tenNguoiDung: post.nguoiDung.tenNguoiDung,
      email: post.nguoiDung.email,
    },
    danhMuc: post.danhMuc.map(dm => ({
      id: dm.id,
      tenDanhMuc: dm.tenDanhMuc,
      moTaDanhMuc: dm.moTaDanhMuc,
    })),
    tags: post.tags.map(tag => ({
      id: tag.id,
      tenTag: tag.tenTag,
    })),
    thumbnail: null,
  };
}
