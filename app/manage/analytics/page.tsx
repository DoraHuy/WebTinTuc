import { prisma } from '@/lib/prisma';
import AnalyticsClient from './AnalyticsClient';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [users, posts, premiumPosts, orders, payments, wallets, codes, codeUsages, recentPosts, topUsers] = await Promise.all([
    prisma.nguoiDungs.count(),
    prisma.tinTucs.count(),
    prisma.tinTucs.count({ where: { isPremium: true } }),
    prisma.order.count(),
    prisma.payment.findMany({ where: { trangThai: 'success' }, select: { soTien: true } }),
    prisma.wallet.findMany({ select: { soDu: true } }),
    prisma.redeemCode.count(),
    prisma.redeemCodeUsage.count(),
    // Bài viết gần đây (30 ngày)
    prisma.tinTucs.groupBy({
      by: ['ngayDang'],
      _count: { id: true },
      where: {
        ngayDang: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { ngayDang: 'asc' }
    }),
    // Top người dùng
    prisma.nguoiDungs.findMany({
      include: {
        tinTuc: true,
        wallet: true,
        purchasedPosts: true,
      },
      orderBy: { id: 'asc' },
      take: 10,
    })
  ]);

  const revenue = payments.reduce((sum, p) => sum + (p.soTien || 0), 0);
  const totalWallet = wallets.reduce((sum, w) => sum + (w.soDu || 0), 0);

  // Nhóm bài viết theo ngày
  const postsByDate = recentPosts.map(p => ({
    date: p.ngayDang.toISOString().split('T')[0],
    count: p._count.id
  }));

  // Top users data
  const topUsersData = topUsers.map(u => ({
    name: u.tenNguoiDung,
    posts: u.tinTuc.length,
    wallet: u.wallet?.soDu || 0,
    purchased: u.purchasedPosts.length,
  })).sort((a, b) => b.posts - a.posts).slice(0, 5);

  const stats = {
    users,
    posts,
    premiumPosts,
    orders,
    revenue,
    totalWallet,
    codes,
    codeUsages,
  };

  return <AnalyticsClient stats={stats} postsByDate={postsByDate} topUsers={topUsersData} />;
}

function Stat({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
