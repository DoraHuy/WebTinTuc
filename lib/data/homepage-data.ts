import { Post, Author, Category, Tag, TopAuthor, TrendingPost } from '@/lib/types/Homepage';

// Import data trực tiếp từ JSON
const homepageDataJson = require('../../public/data/homepage-data.json');

export function getHomepageData() {
  return homepageDataJson;
}

export function getPosts(options?: {
  limit?: number;
  offset?: number;
  categoryId?: number;
  isPremium?: boolean;
  sortBy?: 'latest' | 'trending' | 'popular';
}): Post[] {
  const data = getHomepageData();
  const { limit, offset = 0, categoryId, isPremium, sortBy = 'latest' } = options || {};
  
  let posts = data.posts.map((post: any) => ({
    ...post,
    nguoiDung: data.authors.find((a: any) => a.id === post.authorId),
    danhMuc: post.categoryIds.map((cId: number) => 
      data.categories.find((c: any) => c.id === cId)
    ),
    tags: post.tagIds.map((tId: number) => 
      data.tags.find((t: any) => t.id === tId)
    ),
  }));
  
  // Filter by category
  if (categoryId) {
    posts = posts.filter((post: Post) => 
      post.danhMuc.some(c => c.id === categoryId)
    );
  }
  
  // Filter by premium
  if (isPremium !== undefined) {
    posts = posts.filter((post: Post) => post.isPremium === isPremium);
  }
  
  // Sort
  if (sortBy === 'trending' || sortBy === 'popular') {
    posts.sort((a: Post, b: Post) => (b.viewCount || 0) - (a.viewCount || 0));
  } else {
    posts.sort((a: Post, b: Post) => 
      new Date(b.ngayDang).getTime() - new Date(a.ngayDang).getTime()
    );
  }
  
  // Pagination
  if (limit) {
    posts = posts.slice(offset, offset + limit);
  }
  
  return posts;
}

export function getFeaturedPost(): Post {
  const posts = getPosts({ sortBy: 'popular', limit: 1 });
  return posts[0];
}

export function getLatestPosts(limit: number = 4): Post[] {
  return getPosts({ limit, sortBy: 'latest' });
}

export function getCategories(): Category[] {
  const data = getHomepageData();
  return data.categories;
}

export function getTags(): Tag[] {
  const data = getHomepageData();
  return data.tags;
}

export function getTopAuthors(type: 'posts' | 'interactions' | 'revenue', limit: number = 5): TopAuthor[] {
  const data = getHomepageData();
  const authors = [...data.authors];
  
  let sortKey: 'totalPosts' | 'totalInteractions' | 'totalRevenue' = 'totalPosts';
  if (type === 'interactions') sortKey = 'totalInteractions';
  if (type === 'revenue') sortKey = 'totalRevenue';
  
  authors.sort((a: any, b: any) => b[sortKey] - a[sortKey]);
  
  return authors.slice(0, limit).map((author: any, index: number) => ({
    ...author,
    rank: index + 1,
    stats: author[sortKey],
  }));
}

export function getTrendingPosts(limit: number = 5): TrendingPost[] {
  const posts = getPosts({ sortBy: 'trending', limit });
  
  return posts.map((post: Post) => ({
    id: post.id,
    tenTinTuc: post.tenTinTuc,
    viewCount: post.viewCount || 0,
    ngayDang: post.ngayDang,
    nguoiDung: {
      tenNguoiDung: post.nguoiDung.tenNguoiDung,
    },
    thumbnail: post.thumbnail,
  }));
}

export function getTotalPosts(filters?: {
  categoryId?: number;
  isPremium?: boolean;
}): number {
  const data = getHomepageData();
  let posts = data.posts;
  
  if (filters?.categoryId) {
    posts = posts.filter((post: any) => 
      post.categoryIds.includes(filters.categoryId)
    );
  }
  
  if (filters?.isPremium !== undefined) {
    posts = posts.filter((post: any) => post.isPremium === filters.isPremium);
  }
  
  return posts.length;
}

export function getPostById(id: number): Post | null {
  const data = getHomepageData();
  const post = data.posts.find((p: any) => p.id === id);
  
  if (!post) return null;
  
  return {
    ...post,
    nguoiDung: data.authors.find((a: any) => a.id === post.authorId),
    danhMuc: post.categoryIds.map((cId: number) => 
      data.categories.find((c: any) => c.id === cId)
    ),
    tags: post.tagIds.map((tId: number) => 
      data.tags.find((t: any) => t.id === tId)
    ),
  };
}
