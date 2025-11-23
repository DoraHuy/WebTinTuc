import { PrismaClient } from '@/lib/generated/prisma';
import AuthorProfileClient from './AuthorProfileClient';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

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
        },
        orderBy: { ngayDang: 'desc' }
      }
    }
  });
  
  if (!author) {
    notFound();
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
    totalInteractions: 0,
    totalRevenue: 0,
  };

  const formattedPosts = author.tinTuc.map(post => ({
    id: post.id,
    tenTinTuc: post.tenTinTuc,
    tomTat: post.tomTat,
    ngayDang: post.ngayDang,
    isPremium: false,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    thumbnail: null,
  }));

  return <AuthorProfileClient author={formattedAuthor} posts={formattedPosts} />;
}
