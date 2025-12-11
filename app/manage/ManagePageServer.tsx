import { prisma } from '@/lib/prisma';
import ManagePageClient from './ManagePageClient';

export default async function ManagePageServer() {
  try {
    // Lấy tất cả bài viết
    const posts = await prisma.tinTucs.findMany({
      select: {
        id: true,
        tenTinTuc: true,
        thoiGianDang: true,
        isPremium: true,
        maNguoiDung: true,
        nguoiDung: {
          select: {
            tenNguoiDung: true,
            email: true,
          },
        },
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
      },
    });

    // Lấy tất cả người dùng và ví của họ
    const users = await prisma.nguoiDungs.findMany({
      select: {
        id: true,
        tenNguoiDung: true,
        email: true,
        tinTuc: {
          select: {
            id: true,
          },
        },
        wallet: {
          select: {
            soDu: true,
          },
        },
      },
    });

    // Tính toán thống kê
    const totalPosts = posts.length;
    const totalAuthors = users.length;
    const totalViews = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + (post.bookmarks?.length || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.binhLuan?.length || 0), 0);
    const totalRevenue = users.reduce((sum, user) => sum + (user.wallet?.soDu || 0), 0);
    const premiumPosts = posts.filter(p => p.isPremium).length;

    // Top tác giả (theo số bài viết)
    const topAuthors = users
      .map(u => ({
        id: u.id,
        tenNguoiDung: u.tenNguoiDung,
        email: u.email,
        totalPosts: u.tinTuc.length,
      }))
      .sort((a, b) => b.totalPosts - a.totalPosts)
      .slice(0, 5);

    // Top nạp tiền (dựa trên số dư ví)
    const topRevenue = users
      .map(u => ({
        id: u.id,
        tenNguoiDung: u.tenNguoiDung,
        email: u.email,
        totalRevenue: u.wallet?.soDu || 0,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    // Bài viết mới nhất
    const latestPosts = [...posts]
      .sort((a, b) => new Date(b.thoiGianDang).getTime() - new Date(a.thoiGianDang).getTime())
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        tenTinTuc: p.tenTinTuc,
        tenNguoiDung: p.nguoiDung?.tenNguoiDung || 'Ẩn danh',
        isPremium: p.isPremium,
        ngayDang: p.thoiGianDang,
        viewCount: 0,
        likeCount: p.bookmarks?.length || 0,
        commentCount: p.binhLuan?.length || 0,
      }));

    return (
      <ManagePageClient
        totalPosts={totalPosts}
        totalAuthors={totalAuthors}
        totalViews={totalViews}
        totalLikes={totalLikes}
        totalComments={totalComments}
        totalRevenue={totalRevenue}
        premiumPosts={premiumPosts}
        topAuthors={topAuthors}
        topRevenue={topRevenue}
        latestPosts={latestPosts}
      />
    );
  } catch (error) {
    console.error('Error loading manage page:', error);
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Lỗi khi tải dữ liệu</h1>
        <p className="text-muted-foreground">Vui lòng thử lại sau</p>
      </div>
    );
  }
}
