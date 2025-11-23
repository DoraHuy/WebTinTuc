import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// GET - Lấy thông tin ví
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    let wallet = await prisma.wallet.findUnique({
      where: {
        maNguoiDung: parseInt(userId),
      },
      include: {
        transactions: {
          orderBy: {
            ngayGD: "desc",
          },
          take: 10,
        },
      },
    });

    // Tạo ví nếu chưa có
    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          maNguoiDung: parseInt(userId),
          soDu: 0,
        },
        include: {
          transactions: true,
        },
      });
    }

    return NextResponse.json(wallet);
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}

// POST - Nạp tiền vào ví
export async function POST(req: NextRequest) {
  try {
    const { userId, amount, method } = await req.json();

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "userId and valid amount are required" },
        { status: 400 }
      );
    }

    // Lấy hoặc tạo ví
    let wallet = await prisma.wallet.findUnique({
      where: { maNguoiDung: parseInt(userId) },
    });

    if (!wallet) {
      wallet = await prisma.wallet.create({
        data: {
          maNguoiDung: parseInt(userId),
          soDu: 0,
        },
      });
    }

    // Thực hiện transaction nạp tiền
    const result = await prisma.$transaction(async (tx) => {
      // Cập nhật số dư
      const updatedWallet = await tx.wallet.update({
        where: { maNguoiDung: parseInt(userId) },
        data: {
          soDu: {
            increment: parseInt(amount),
          },
        },
      });

      // Ghi lại transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          maVi: updatedWallet.id,
          loaiGD: "deposit",
          soTien: parseInt(amount),
          moTa: `Nạp tiền qua ${method || "bank_transfer"}`,
        },
      });

      return { wallet: updatedWallet, transaction };
    });

    return NextResponse.json({
      message: "Deposit successful",
      wallet: result.wallet,
      transaction: result.transaction,
    });
  } catch (error) {
    console.error("Error depositing to wallet:", error);
    return NextResponse.json(
      { error: "Failed to deposit" },
      { status: 500 }
    );
  }
}
