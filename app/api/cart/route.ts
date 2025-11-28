import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ items: [] }, { status: 200 });

  const items = await prisma.cart.findMany({
    where: { maNguoiDung: session.userId },
    include: { tinTuc: true },
    orderBy: { ngayThem: "desc" },
  });

  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

  const body = await req.json();
  const { postId } = body || {};
  if (!postId || typeof postId !== "number") {
    return NextResponse.json({ error: "Thiếu postId" }, { status: 400 });
  }

  // Lấy giá để hiển thị (không bắt buộc trong giỏ)
  const post = await prisma.tinTucs.findUnique({ where: { id: postId } });
  if (!post) return NextResponse.json({ error: "Bài viết không tồn tại" }, { status: 404 });

  try {
    await prisma.cart.create({
      data: {
        maNguoiDung: session.userId,
        maTinTuc: postId,
      },
    });
  } catch (e) {
    // unique constraint -> đã tồn tại trong giỏ
    return NextResponse.json({ error: "Bài viết đã có trong giỏ hàng" }, { status: 400 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : NaN;
  if (!id) return NextResponse.json({ error: "Thiếu id giỏ hàng" }, { status: 400 });

  await prisma.cart.delete({ where: { id } });
  return NextResponse.json({ success: true }, { status: 200 });
}
