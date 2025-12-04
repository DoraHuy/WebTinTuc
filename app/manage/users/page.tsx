import { prisma } from '@/lib/prisma';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic';

export default async function ManageUsersPage() {
  const users = await prisma.nguoiDungs.findMany({
    include: {
      wallet: true,
      purchasedPosts: true,
      postSubmissions: true,
      nguoiDungVaiTro: {
        include: { vaiTro: true },
      },
    },
    orderBy: { id: 'asc' },
  });
  const allRoles = await prisma.vaiTros.findMany({ orderBy: { id: 'asc' } });

  // Serialize data
  const serialized = users.map(u => ({
    id: u.id,
    tenNguoiDung: u.tenNguoiDung,
    email: u.email,
    vaiTro: u.nguoiDungVaiTro?.map(v => v.vaiTro.tenVaiTro).join(', ') || '—',
    vaiTroIds: u.nguoiDungVaiTro?.map(v => v.maVaiTro) || [],
    soDu: u.wallet?.soDu || 0,
    purchasedCount: u.purchasedPosts.length,
    submissionsCount: u.postSubmissions.length,
  }));

  const rolesData = allRoles.map(r => ({ id: r.id, tenVaiTro: r.tenVaiTro }));

  return <UsersClient users={serialized} roles={rolesData} />;
}
