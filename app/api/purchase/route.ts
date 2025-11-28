import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

// POST: body { postId: number, userId: number }
export async function POST(req: NextRequest) {
  try {
    const { postId, userId } = await req.json();
    
    if (!postId || !userId) {
      return NextResponse.json({ error: "Thiếu postId hoặc userId" }, { status: 400 });
    }

    const post = await prisma.tinTucs.findUnique({ where: { id: postId } });
    if (!post || !post.isPremium) {
      return NextResponse.json({ error: "Bài không premium hoặc không tồn tại" }, { status: 400 });
    }

    // Nếu đã mua rồi -> trả về success
    const existed = await prisma.purchasedPost.findUnique({
      where: { maNguoiDung_maTinTuc: { maNguoiDung: userId, maTinTuc: postId } },
    });
    if (existed) {
      return NextResponse.json({ success: true, message: "Bạn đã sở hữu bài viết này" }, { status: 200 });
    }

    // Kiểm tra ví và số dư
    let wallet = await prisma.wallet.findUnique({
      where: { maNguoiDung: userId },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: { maNguoiDung: userId, soDu: 0 },
      });
    }

    const price = post.gia ?? 0;
    if (wallet.soDu < price) {
      return NextResponse.json(
        { error: "Số dư không đủ. Vui lòng nạp thêm tiền vào ví." },
        { status: 400 }
      );
    }

    // Transaction: Trừ tiền và tạo purchased record
    await prisma.$transaction(async (tx) => {
      // Trừ tiền từ ví
      await tx.wallet.update({
        where: { id: wallet!.id },
        data: { soDu: { decrement: price } },
      });

      // Ghi lại transaction
      await tx.walletTransaction.create({
        data: {
          maVi: wallet!.id,
          loaiGD: "purchase",
          soTien: -price,
          moTa: `Mua bài viết: ${post.tenTinTuc}`,
        },
      });

      // Tạo purchased record
      await tx.purchasedPost.create({
        data: {
          maNguoiDung: userId,
          maTinTuc: postId,
          gia: price,
        },
      });

      // Xóa khỏi cart nếu có
      await tx.cart.deleteMany({
        where: { maNguoiDung: userId, maTinTuc: postId },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Mua thành công! Đã trừ tiền từ ví.",
      newBalance: wallet.soDu - price,
    });
  } catch (error: any) {
    console.error("Error purchasing post:", error);
    return NextResponse.json(
      { error: error.message || "Lỗi khi mua bài viết" },
      { status: 500 }
    );
  }
}
