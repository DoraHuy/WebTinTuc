import { prisma } from '@/lib/prisma';
import PostsManageClient from './PostsManageClient';

export const dynamic = 'force-dynamic';

export default async function PostPage() {
  const [posts, categories, users] = await Promise.all([
    prisma.tinTucs.findMany({
      include: {
        nguoiDung: true,
        danhMuc: true,
        tags: true,
      },
      orderBy: { ngayDang: 'desc' },
    }),
    prisma.danhMucs.findMany({ orderBy: { tenDanhMuc: 'asc' } }),
    prisma.nguoiDungs.findMany({ orderBy: { tenNguoiDung: 'asc' } }),
  ]);

  const serialized = posts.map(p => ({
    id: p.id,
    tenTinTuc: p.tenTinTuc,
    tomTat: p.tomTat || '',
    noiDungTinTuc: p.noiDungTinTuc,
    ngayDang: p.ngayDang.toISOString(),
    isPremium: p.isPremium,
    gia: p.gia || 0,
    trangThaiDuyet: p.trangThaiDuyet,
    nguoiDung: { id: p.maNguoiDung, tenNguoiDung: p.nguoiDung.tenNguoiDung },
    danhMuc: p.danhMuc.map(dm => ({ id: dm.id, tenDanhMuc: dm.tenDanhMuc })),
    tags: p.tags.map(t => ({ id: t.id, tenTag: t.tenTag })),
  }));

  const categoriesData = categories.map(c => ({ id: c.id, tenDanhMuc: c.tenDanhMuc }));
  const usersData = users.map(u => ({ id: u.id, tenNguoiDung: u.tenNguoiDung }));

  return <PostsManageClient posts={serialized} categories={categoriesData} users={usersData} />;
}