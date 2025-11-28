'use server';

import { prisma } from '@/lib/prisma';
import { Post, Category, Tag, TopAuthor, TrendingPost } from '@/lib/types/Homepage';

// Helper: Chuyển đổi dữ liệu DB -> Frontend
const mapDbPostToPost = (dbPost: any): Post => ({
  id: dbPost.id,
  tenTinTuc: dbPost.tenTinTuc,
  tomTat: dbPost.tomTat || '',
  noiDungTinTuc: dbPost.noiDungTinTuc,
  // Chuyển Date sang String để tránh lỗi serialize của Next.js
  ngayDang: dbPost.ngayDang ? dbPost.ngayDang.toISOString() : new Date().toISOString(),
  thoiGianChinhSua: dbPost.thoiGianChinhSua?.toISOString(),
  isPremium: dbPost.isPremium,
  premiumType: dbPost.premiumType as 'paid' | 'rewrite',
  viewCount: dbPost.viewCount,
  likeCount: dbPost.likeCount,
  commentCount: dbPost._count?.binhLuan || 0,
  nguoiDung: {
    id: dbPost.nguoiDung.id,
    tenNguoiDung: dbPost.nguoiDung.tenNguoiDung,
    email: dbPost.nguoiDung.email,
    // Tạo avatar giả lập theo tên
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbPost.nguoiDung.tenNguoiDung}`
  },
  danhMuc: dbPost.danhMuc.map((dm: any) => ({
    id: dm.id,
    tenDanhMuc: dm.tenDanhMuc,
    moTaDanhMuc: dm.moTaDanhMuc
  })),
  tags: dbPost.tags.map((t: any) => ({
    id: t.id,
    tenTag: t.tenTag
  })),
  thumbnail: dbPost.thumbnail || null
});

// 1. Lấy danh sách bài viết (có lọc/phân trang)
export async function getPosts(options?: {
  limit?: number;
  offset?: number;
  categoryId?: number;
  isPremium?: boolean;
  sortBy?: 'latest' | 'trending' | 'popular';
}): Promise<Post[]> {
  const { limit = 10, offset = 0, categoryId, isPremium, sortBy = 'latest' } = options || {};

  const where: any = {};
  /*const where: any = {
    trangThaiDuyet: true, // <--- THÊM DÒNG NÀY: Chỉ lấy bài đã duyệt
  };*/
  if (categoryId) where.danhMuc = { some: { id: categoryId } };
  if (isPremium !== undefined) where.isPremium = isPremium;

  let orderBy: any = { ngayDang: 'desc' };
  if (sortBy === 'trending' || sortBy === 'popular') orderBy = { viewCount: 'desc' };

  const dbPosts = await prisma.tinTucs.findMany({
    where,
    take: limit,
    skip: offset,
    orderBy,
    include: {
      nguoiDung: true,
      danhMuc: true,
      tags: true,
      _count: { select: { binhLuan: true } }
    }
  });

  return dbPosts.map(mapDbPostToPost);
}

// 2. Các hàm lấy dữ liệu khác (Featured, Latest, Categories...)
export async function getFeaturedPost(): Promise<Post> {
  const post = await prisma.tinTucs.findFirst({
    orderBy: { viewCount: 'desc' },
    include: { nguoiDung: true, danhMuc: true, tags: true, _count: { select: { binhLuan: true } } }
  });
  if (!post) throw new Error("Chưa có bài viết nào");
  return mapDbPostToPost(post);
}

export async function getLatestPosts(limit: number = 4): Promise<Post[]> {
  return getPosts({ limit, sortBy: 'latest' });
}

export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.danhMucs.findMany();
  return categories.map(c => ({ id: c.id, tenDanhMuc: c.tenDanhMuc, moTaDanhMuc: c.moTaDanhMuc || '' }));
}

export async function getTags(): Promise<Tag[]> {
  return await prisma.tags.findMany();
}

export async function getTopAuthors(type: 'posts' | 'interactions' | 'revenue', limit: number = 5): Promise<TopAuthor[]> {
  const authors = await prisma.nguoiDungs.findMany({
    where: { tinTuc: { some: {} } },
    include: { tinTuc: { select: { viewCount: true, likeCount: true } } }
  });

  const calculatedAuthors = authors.map(author => {
    const totalPosts = author.tinTuc.length;
    const totalInteractions = author.tinTuc.reduce((sum, p) => sum + p.viewCount + p.likeCount, 0);
    const totalRevenue = totalInteractions * 100 + (totalPosts * 50000);

    let stats = 0;
    if (type === 'posts') stats = totalPosts;
    else if (type === 'interactions') stats = totalInteractions;
    else if (type === 'revenue') stats = totalRevenue;

    return { ...author, totalPosts, totalInteractions, totalRevenue, stats, rank: 0 };
  });

  return calculatedAuthors.sort((a, b) => b.stats - a.stats).slice(0, limit).map((a, i) => ({ ...a, rank: i + 1 }));
}

export async function getTrendingPosts(limit: number = 5): Promise<TrendingPost[]> {
  const posts = await prisma.tinTucs.findMany({
    take: limit,
    orderBy: { viewCount: 'desc' },
    select: { id: true, tenTinTuc: true, viewCount: true, ngayDang: true, thumbnail: true, nguoiDung: { select: { tenNguoiDung: true } } }
  });
  return posts.map(p => ({
    id: p.id,
    tenTinTuc: p.tenTinTuc,
    viewCount: p.viewCount,
    ngayDang: p.ngayDang.toISOString(),
    thumbnail: p.thumbnail || undefined,
    nguoiDung: { tenNguoiDung: p.nguoiDung.tenNguoiDung }
  }));
}

export async function getTotalPosts(filters?: { categoryId?: number; isPremium?: boolean }): Promise<number> {
  const where: any = {};
  if (filters?.categoryId) where.danhMuc = { some: { id: filters.categoryId } };
  if (filters?.isPremium !== undefined) where.isPremium = filters.isPremium;
  return await prisma.tinTucs.count({ where });
}

export async function getPostById(id: number): Promise<Post | null> {
  const post = await prisma.tinTucs.findUnique({
    where: { id },
    include: { nguoiDung: true, danhMuc: true, tags: true, _count: { select: { binhLuan: true } } }
  });
  return post ? mapDbPostToPost(post) : null;
}
export async function getAllAuthorsWithData() {
  const authors = await prisma.nguoiDungs.findMany({
    // Chỉ lấy những người có vai trò là Author hoặc Editor (hoặc lấy hết tùy bạn)
    // Ở đây mình lấy hết người dùng có bài viết để demo
    where: {
      tinTuc: { some: {} }
    },
    include: {
      tinTuc: {
        include: {
          tags: true,
          danhMuc: true,
          _count: { select: { binhLuan: true } }
        },
        orderBy: { ngayDang: 'desc' }
      }
    }
  });

  return authors.map(author => {
    // Tính toán thống kê
    const totalPosts = author.tinTuc.length;
    const totalViews = author.tinTuc.reduce((sum, p) => sum + p.viewCount, 0);
    const totalLikes = author.tinTuc.reduce((sum, p) => sum + p.likeCount, 0);
    const totalComments = author.tinTuc.reduce((sum, p) => sum + (p._count?.binhLuan || 0), 0);
    const totalInteractions = totalViews + totalLikes + totalComments;

    // Giả lập doanh thu (50đ/view + 1000đ/like)
    const totalRevenue = (totalViews * 50) + (totalLikes * 1000);

    // Map bài viết sang format Frontend
    const posts = author.tinTuc.map(dbPost => ({
      ...mapDbPostToPost({ ...dbPost, nguoiDung: author }),
      // Gán lại tên người dùng vì mapDbPostToPost cần object nguoiDung
      nguoiDung: {
        id: author.id,
        tenNguoiDung: author.tenNguoiDung,
        email: author.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.tenNguoiDung}`
      }
    }));

    return {
      id: author.id,
      tenNguoiDung: author.tenNguoiDung,
      email: author.email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.tenNguoiDung}`,
      totalPosts,
      totalInteractions,
      totalRevenue,
      posts // Danh sách bài viết của tác giả đó
    };
  });
}