import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

// POST: body { postId: number }
export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const { postId } = await req.json();
  if (!postId || typeof postId !== "number") {
    return NextResponse.json({ error: "Thiếu postId" }, { status: 400 });
  }

  const post = await prisma.tinTucs.findUnique({ where: { id: postId } });
  if (!post || !post.isPremium) return NextResponse.json({ error: "Bài không premium hoặc không tồn tại" }, { status: 400 });

  // Nếu đã mua rồi -> trả về success
  const existed = await prisma.purchasedPost.findUnique({
    where: { maNguoiDung_maTinTuc: { maNguoiDung: session.userId, maTinTuc: postId } },
  });
  if (existed) return NextResponse.json({ success: true }, { status: 200 });

  // Tạo order và purchased record đơn giản (bỏ qua thanh toán chi tiết)
  const order = await prisma.order.create({
    data: {
      maNguoiDung: session.userId,
      tongTien: post.gia ?? 0,
      trangThai: "completed",
      orderItems: {
        create: [{ maTinTuc: postId, gia: post.gia ?? 0 }],
      },
    },
  });

  await prisma.purchasedPost.create({
    data: {
      maNguoiDung: session.userId,
      maTinTuc: postId,
      gia: post.gia ?? 0,
    },
  });

  return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });
}
