export interface Author {
  id: number;
  tenNguoiDung: string;
  email: string;
  avatar?: string;
  totalPosts?: number;
  totalInteractions?: number;
  totalRevenue?: number;
}

export interface Category {
  id: number;
  tenDanhMuc: string;
  moTaDanhMuc?: string;
}

export interface Tag {
  id: number;
  tenTag: string;
}

export interface Post {
  id: number;
  tenTinTuc: string;
  tomTat?: string;
  noiDungTinTuc: string;
  ngayDang: Date | string;
  thoiGianChinhSua?: Date | string;
  isPremium: boolean;
  premiumType?: 'paid' | 'rewrite'; // trả tiền hoặc viết lại 2 bài
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  nguoiDung: Author;
  danhMuc: Category[];
  tags: Tag[];
  thumbnail?: string;
}

export interface TopAuthor extends Author {
  rank: number;
  stats: number;
}

export interface TrendingPost {
  id: number;
  tenTinTuc: string;
  viewCount: number;
  thumbnail?: string;
  ngayDang: Date | string;
  nguoiDung: {
    tenNguoiDung: string;
  };
}

export type TopPeriod = 'week' | 'month' | 'all';

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface FilterOptions {
  category?: number;
  tag?: number;
  isPremium?: boolean;
  period?: TopPeriod;
  sortBy?: 'latest' | 'trending' | 'popular';
}
