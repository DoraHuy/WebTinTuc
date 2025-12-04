import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = typeof body?.userId === 'string' ? parseInt(body.userId, 10) : body?.userId;
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (body?.wallet?.soDu != null) {
      const soDu = Number(body.wallet.soDu);
      const wallet = await prisma.wallet.upsert({
        where: { maNguoiDung: userId },
        update: { soDu },
        create: { maNguoiDung: userId, soDu },
      });
      return NextResponse.json({ message: 'Cập nhật ví thành công', wallet });
    }

    if (Array.isArray(body?.roles)) {
      // Replace user roles with provided role IDs
      const roleIds: number[] = body.roles.map((r: any) => (typeof r === 'string' ? parseInt(r, 10) : r)).filter(Boolean);
      // Remove existing roles
      await prisma.nguoiDungVaiTro.deleteMany({ where: { maNguoiDung: userId } });
      // Add new roles
      const now = new Date();
      if (roleIds.length > 0) {
        await prisma.nguoiDungVaiTro.createMany({
          data: roleIds.map((rid) => ({ maNguoiDung: userId, maVaiTro: rid, ngayNhan: now, trangThai: true })),
        });
      }
      return NextResponse.json({ message: 'Cập nhật vai trò thành công', roles: roleIds });
    }

    return NextResponse.json({ error: 'Không có trường nào để cập nhật' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Lỗi máy chủ' }, { status: 500 });
  }
}
