import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// POST - Sử dụng mã redeem
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userIdRaw = body?.userId;
    const codeRaw = body?.code;
    const userId = typeof userIdRaw === 'string' ? parseInt(userIdRaw, 10) : userIdRaw;
    const code = typeof codeRaw === 'string' ? codeRaw.trim().toUpperCase() : '';

    if (!userId || !code) {
      return NextResponse.json(
        { error: "userId and code are required" },
        { status: 400 }
      );
    }

    // Tìm mã redeem
    const redeemCode = await prisma.redeemCode.findUnique({
      where: { code: code },
    });

    if (!redeemCode) {
      return NextResponse.json(
        { error: "Invalid redeem code" },
        { status: 404 }
      );
    }

    // Kiểm tra trạng thái mã
    if (!redeemCode.trangThai) {
      return NextResponse.json(
        { error: "This code has been disabled" },
        { status: 400 }
      );
    }

    // Kiểm tra hạn sử dụng
    if (redeemCode.ngayHetHan && redeemCode.ngayHetHan < new Date()) {
      return NextResponse.json(
        { error: "This code has expired" },
        { status: 400 }
      );
    }

    // Kiểm tra số lần sử dụng
    if (redeemCode.daDung >= redeemCode.soLanDung) {
      return NextResponse.json(
        { error: "This code has reached usage limit" },
        { status: 400 }
      );
    }

    // Kiểm tra người dùng đã dùng code này chưa (nếu là single_post)
    if (redeemCode.loaiCode === "single_post") {
      const used = await prisma.redeemCodeUsage.findUnique({
        where: {
          maCode_maNguoiDung: {
            maCode: redeemCode.id,
            maNguoiDung: parseInt(userId),
          },
        },
      });

      if (used) {
        return NextResponse.json(
          { error: "You have already used this code" },
          { status: 400 }
        );
      }
    }

    // Thực hiện transaction
    const result = await prisma.$transaction(async (tx) => {
      // Xử lý theo loại code
      if (redeemCode.loaiCode === "single_post") {
        // Kiểm tra bài viết có tồn tại không
        const post = await tx.tinTucs.findUnique({
          where: { id: redeemCode.giaTri },
        });

        if (!post) {
          throw new Error("Post not found");
        }

        // Kiểm tra đã mua chưa
        const purchased = await tx.purchasedPost.findUnique({
          where: {
            maNguoiDung_maTinTuc: {
              maNguoiDung: parseInt(userId),
              maTinTuc: redeemCode.giaTri,
            },
          },
        });

        if (purchased) {
          throw new Error("You already own this post");
        }

        // Thêm vào purchased posts
        await tx.purchasedPost.create({
          data: {
            maNguoiDung: parseInt(userId),
            maTinTuc: redeemCode.giaTri,
            gia: 0, // Free via redeem code
          },
        });

        // Xóa khỏi cart nếu có
        await tx.cart.deleteMany({
          where: {
            maNguoiDung: parseInt(userId),
            maTinTuc: redeemCode.giaTri,
          },
        });

        // Ghi lại usage
        await tx.redeemCodeUsage.create({
          data: {
            maCode: redeemCode.id,
            maNguoiDung: parseInt(userId),
          },
        });

        // Cập nhật số lần dùng
        await tx.redeemCode.update({
          where: { id: redeemCode.id },
          data: {
            daDung: {
              increment: 1,
            },
          },
        });

        return { type: "post", value: post.tenTinTuc, postId: post.id };
      } else if (redeemCode.loaiCode === "balance") {
        // Lấy hoặc tạo ví
        let wallet = await tx.wallet.findUnique({
          where: { maNguoiDung: parseInt(userId) },
        });

        if (!wallet) {
          wallet = await tx.wallet.create({
            data: {
              maNguoiDung: parseInt(userId),
              soDu: 0,
            },
          });
        }

        // Nạp tiền vào ví
        const updatedWallet = await tx.wallet.update({
          where: { maNguoiDung: parseInt(userId) },
          data: {
            soDu: {
              increment: redeemCode.giaTri,
            },
          },
        });

        // Ghi lại transaction
        await tx.walletTransaction.create({
          data: {
            maVi: updatedWallet.id,
            loaiGD: "deposit",
            soTien: redeemCode.giaTri,
            moTa: `Nạp tiền qua mã redeem: ${code}`,
          },
        });

        // Ghi lại usage
        await tx.redeemCodeUsage.create({
          data: {
            maCode: redeemCode.id,
            maNguoiDung: parseInt(userId),
          },
        });

        // Cập nhật số lần dùng
        await tx.redeemCode.update({
          where: { id: redeemCode.id },
          data: {
            daDung: {
              increment: 1,
            },
          },
        });

        return { type: "balance", value: redeemCode.giaTri, balance: updatedWallet.soDu };
      } else if (redeemCode.loaiCode === "unlimited") {
        // Unlimited access - Ghi nhận người dùng có quyền đọc unlimited
        // Ghi lại usage
        await tx.redeemCodeUsage.create({
          data: {
            maCode: redeemCode.id,
            maNguoiDung: parseInt(userId),
          },
        });

        // Cập nhật số lần dùng
        await tx.redeemCode.update({
          where: { id: redeemCode.id },
          data: {
            daDung: {
              increment: 1,
            },
          },
        });

        return { type: "unlimited", message: "Bạn đã có quyền đọc VÔ HẠN tất cả bài premium!" };
      }

      throw new Error("Invalid code type");
    });

    return NextResponse.json({
      message: "Redeem successful",
      result: result,
    });
  } catch (error: any) {
    console.error("Error redeeming code:", error);
    return NextResponse.json(
      { error: error.message || "Failed to redeem code" },
      { status: 500 }
    );
  }
}

// GET - Kiểm tra mã redeem (không sử dụng, chỉ xem thông tin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "code is required" },
        { status: 400 }
      );
    }

    const redeemCode = await prisma.redeemCode.findUnique({
      where: { code: code },
      include: {
        creator: {
          select: {
            tenNguoiDung: true,
          },
        },
      },
    });

    if (!redeemCode) {
      return NextResponse.json(
        { error: "Invalid redeem code" },
        { status: 404 }
      );
    }

    // Trả về thông tin cơ bản (không tiết lộ quá nhiều)
    return NextResponse.json({
      loaiCode: redeemCode.loaiCode,
      giaTri: redeemCode.giaTri,
      trangThai: redeemCode.trangThai,
      ngayHetHan: redeemCode.ngayHetHan,
      daDung: redeemCode.daDung,
      soLanDung: redeemCode.soLanDung,
    });
  } catch (error) {
    console.error("Error checking code:", error);
    return NextResponse.json(
      { error: "Failed to check code" },
      { status: 500 }
    );
  }
}
