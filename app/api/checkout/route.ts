import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// POST - Thanh toán giỏ hàng
export async function POST(req: NextRequest) {
  try {
    const { userId, paymentMethod } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Lấy các item trong giỏ hàng
    const cartItems = await prisma.cart.findMany({
      where: {
        maNguoiDung: parseInt(userId),
      },
      include: {
        tinTuc: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Tính tổng tiền
    let totalAmount = 0;
    for (const item of cartItems) {
      if (!item.tinTuc.gia) {
        return NextResponse.json(
          { error: `Post ${item.tinTuc.tenTinTuc} has no price set` },
          { status: 400 }
        );
      }
      totalAmount += item.tinTuc.gia;
    }

    // Kiểm tra số dư ví nếu thanh toán bằng wallet
    if (paymentMethod === "wallet") {
      const wallet = await prisma.wallet.findUnique({
        where: { maNguoiDung: parseInt(userId) },
      });

      if (!wallet || wallet.soDu < totalAmount) {
        return NextResponse.json(
          { error: "Insufficient balance" },
          { status: 400 }
        );
      }
    }

    // Tạo transaction để đảm bảo tính toàn vẹn dữ liệu
    const result = await prisma.$transaction(async (tx) => {
      // Tạo đơn hàng
      const order = await tx.order.create({
        data: {
          maNguoiDung: parseInt(userId),
          tongTien: totalAmount,
          trangThai: "pending",
        },
      });

      // Tạo các OrderItem
      for (const item of cartItems) {
        await tx.orderItem.create({
          data: {
            maOrder: order.id,
            maTinTuc: item.maTinTuc,
            gia: item.tinTuc.gia!,
          },
        });
      }

      // Xử lý thanh toán
      let paymentStatus = "pending";
      let transactionId: string | null = null;

      if (paymentMethod === "wallet") {
        // Trừ tiền từ ví
        await tx.wallet.update({
          where: { maNguoiDung: parseInt(userId) },
          data: {
            soDu: {
              decrement: totalAmount,
            },
          },
        });

        // Ghi lại transaction
        await tx.walletTransaction.create({
          data: {
            maVi: (await tx.wallet.findUnique({
              where: { maNguoiDung: parseInt(userId) },
            }))!.id,
            loaiGD: "purchase",
            soTien: totalAmount,
            moTa: `Mua ${cartItems.length} bài viết`,
          },
        });

        paymentStatus = "success";
        transactionId = `WALLET_${Date.now()}`;

        // Cập nhật trạng thái đơn hàng
        await tx.order.update({
          where: { id: order.id },
          data: { trangThai: "completed" },
        });

        // Thêm các bài viết vào danh sách đã mua
        for (const item of cartItems) {
          await tx.purchasedPost.create({
            data: {
              maNguoiDung: parseInt(userId),
              maTinTuc: item.maTinTuc,
              gia: item.tinTuc.gia!,
            },
          });
        }

        // Xóa giỏ hàng
        await tx.cart.deleteMany({
          where: {
            maNguoiDung: parseInt(userId),
          },
        });
      }

      // Tạo payment record
      const payment = await tx.payment.create({
        data: {
          maOrder: order.id,
          phuongThuc: paymentMethod,
          soTien: totalAmount,
          trangThai: paymentStatus,
          transactionId: transactionId,
        },
      });

      return { order, payment };
    });

    return NextResponse.json({
      message: "Checkout successful",
      order: result.order,
      payment: result.payment,
    });
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { error: "Failed to process checkout" },
      { status: 500 }
    );
  }
}
