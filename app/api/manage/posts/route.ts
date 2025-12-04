import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Thêm bài viết mới
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenTinTuc, tomTat, noiDungTinTuc, isPremium, gia, maNguoiDung } = body;

    if (!tenTinTuc || !noiDungTinTuc) {
      return NextResponse.json({ error: 'Tiêu đề và nội dung là bắt buộc' }, { status: 400 });
    }

    const post = await prisma.tinTucs.create({
      data: {
        tenTinTuc,
        tomTat: tomTat || '',
        noiDungTinTuc,
        isPremium: isPremium || false,
        gia: isPremium ? (gia || 0) : null,
        maNguoiDung: maNguoiDung || 1, // Default user if not provided
        trangThaiDuyet: false,
      },
    });

    return NextResponse.json({ message: 'Thêm bài viết thành công', post });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Lỗi máy chủ' }, { status: 500 });
  }
}

// PATCH: Cập nhật bài viết
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, tenTinTuc, tomTat, noiDungTinTuc, isPremium, gia, trangThaiDuyet } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID bài viết là bắt buộc' }, { status: 400 });
    }

    const updateData: any = {};
    if (tenTinTuc !== undefined) updateData.tenTinTuc = tenTinTuc;
    if (tomTat !== undefined) updateData.tomTat = tomTat;
    if (noiDungTinTuc !== undefined) updateData.noiDungTinTuc = noiDungTinTuc;
    if (isPremium !== undefined) {
      updateData.isPremium = isPremium;
      updateData.gia = isPremium ? (gia || 0) : null;
    }
    if (trangThaiDuyet !== undefined) updateData.trangThaiDuyet = trangThaiDuyet;

    const post = await prisma.tinTucs.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json({ message: 'Cập nhật bài viết thành công', post });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Lỗi máy chủ' }, { status: 500 });
  }
}

// DELETE: Xóa bài viết
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID bài viết là bắt buộc' }, { status: 400 });
    }

    // Xóa các quan hệ trước
    await prisma.cart.deleteMany({ where: { maTinTuc: Number(id) } });
    await prisma.orderItem.deleteMany({ where: { maTinTuc: Number(id) } });
    await prisma.purchasedPost.deleteMany({ where: { maTinTuc: Number(id) } });
    await prisma.binhLuans.deleteMany({ where: { maTinTuc: Number(id) } });

    // Xóa bài viết
    await prisma.tinTucs.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Xóa bài viết thành công' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Lỗi máy chủ' }, { status: 500 });
  }
}
