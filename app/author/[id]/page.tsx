import { prisma } from '@/lib/prisma';
import AuthorProfileClient from './AuthorProfileClient';
import { notFound } from 'next/navigation';


export default async function AuthorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const authorId = parseInt(id);
  
  // Lấy thông tin tác giả từ MySQL
  const author = await prisma.nguoiDungs.findUnique({
    where: { id: authorId },
    include: {
      tinTuc: {
        where: { trangThaiDuyet: true },
        include: {
          danhMuc: true,
          tags: true,
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
          ratings: {
            select: {
              rating: true,
            },
          },
        },
        orderBy: { ngayDang: 'desc' }
      },
      wallet: {
        select: {
          soDu: true,
        },
      },
    }
  });
  
  if (!author) {
    notFound();
  }

  // Tính tổng tương tác
  const totalInteractions = author.tinTuc.reduce((sum, post) => {
    return sum + (post.bookmarks?.length || 0) + (post.binhLuan?.length || 0);
  }, 0);

  // Tính đánh giá trung bình của tác giả
  let averageRating = 0;
  let totalRatings = 0;
  author.tinTuc.forEach(post => {
    if (post.ratings && post.ratings.length > 0) {
      const sum = post.ratings.reduce((acc, r) => acc + r.rating, 0);
      totalRatings += post.ratings.length;
      averageRating += sum;
    }
  });
  if (totalRatings > 0) {
    averageRating = averageRating / totalRatings;
  }

  // Format dữ liệu cho component
  const formattedAuthor = {
    id: author.id,
    tenNguoiDung: author.tenNguoiDung,
    email: author.email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.tenNguoiDung}`,
    bio: `Tác giả tại TechNews`,
    totalPosts: author.tinTuc.length,
    followers: [],
    topDonors: [],
    commenters: [],
    totalInteractions: totalInteractions,
    totalRevenue: author.wallet?.soDu || 0,
    averageRating: parseFloat(averageRating.toFixed(1)),
    totalRatings: totalRatings,
  };

  const formattedPosts = author.tinTuc.map(post => {
    const seed = typeof post.id === 'number' ? post.id : post.tenTinTuc.length;
    const fallbackImage = `https://picsum.photos/seed/${seed}/800/600`;
    
    // Tính rating cho bài viết
    let postRating = 0;
    if (post.ratings && post.ratings.length > 0) {
      const sum = post.ratings.reduce((acc, r) => acc + r.rating, 0);
      postRating = sum / post.ratings.length;
    }
    
    return {
      id: post.id,
      tenTinTuc: post.tenTinTuc,
      tomTat: post.tomTat || post.tenTinTuc.substring(0, 100) + '...',
      ngayDang: post.ngayDang,
      isPremium: post.isPremium,
      viewCount: 0,
      likeCount: post.bookmarks?.length || 0,
      commentCount: post.binhLuan?.length || 0,
      ratingCount: post.ratings?.length || 0,
      averageRating: parseFloat(postRating.toFixed(1)),
      thumbnail: fallbackImage,
      ratings: post.ratings || [],
    };
  });

  return <AuthorProfileClient author={formattedAuthor} posts={formattedPosts} />;
}
