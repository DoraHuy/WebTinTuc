import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// Hàm tạo mã ngẫu nhiên
function generateCode(length: number = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// POST - Tạo mã redeem mới
export async function POST(req: NextRequest) {
  try {
    const {
      userId, // Admin user ID
      loaiCode, // single_post, unlimited, balance
      giaTri, // Post ID hoặc số tiền
      soLanDung = 1,
      ngayHetHan,
    } = await req.json();

    if (!userId || !loaiCode || !giaTri) {
      return NextResponse.json(
        { error: "userId, loaiCode, and giaTri are required" },
        { status: 400 }
      );
    }

    // Validate loại code
    if (!["single_post", "unlimited", "balance"].includes(loaiCode)) {
      return NextResponse.json(
        { error: "Invalid code type" },
        { status: 400 }
      );
    }

    // Validate post exists nếu là single_post
    if (loaiCode === "single_post") {
      const post = await prisma.tinTucs.findUnique({
        where: { id: parseInt(giaTri) },
      });

      if (!post) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }
    }

    // Tạo mã unique
    let code = generateCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.redeemCode.findUnique({
        where: { code },
      });
      if (!existing) break;
      code = generateCode();
      attempts++;
    }

    // Tạo redeem code
    const redeemCode = await prisma.redeemCode.create({
      data: {
        code,
        loaiCode,
        giaTri: parseInt(giaTri),
        soLanDung: parseInt(soLanDung),
        nguoiTao: parseInt(userId),
        ngayHetHan: ngayHetHan ? new Date(ngayHetHan) : null,
      },
      include: {
        creator: {
          select: {
            tenNguoiDung: true,
          },
        },
      },
    });

    return NextResponse.json(redeemCode, { status: 201 });
  } catch (error) {
    console.error("Error creating redeem code:", error);
    return NextResponse.json(
      { error: "Failed to create redeem code" },
      { status: 500 }
    );
  }
}

// GET - Lấy danh sách mã redeem (cho admin)
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

    const codes = await prisma.redeemCode.findMany({
      where: {
        nguoiTao: parseInt(userId),
      },
      include: {
        creator: {
          select: {
            tenNguoiDung: true,
          },
        },
        usedBy: {
          include: {
            nguoiDung: {
              select: {
                tenNguoiDung: true,
              },
            },
          },
        },
      },
      orderBy: {
        ngayTao: "desc",
      },
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error("Error fetching redeem codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch redeem codes" },
      { status: 500 }
    );
  }
}

// PATCH - Cập nhật trạng thái mã redeem
export async function PATCH(req: NextRequest) {
  try {
    const { codeId, trangThai } = await req.json();

    if (!codeId || trangThai === undefined) {
      return NextResponse.json(
        { error: "codeId and trangThai are required" },
        { status: 400 }
      );
    }

    const updatedCode = await prisma.redeemCode.update({
      where: { id: parseInt(codeId) },
      data: {
        trangThai: Boolean(trangThai),
      },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error("Error updating redeem code:", error);
    return NextResponse.json(
      { error: "Failed to update redeem code" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa mã redeem
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const codeId = searchParams.get("codeId");

    if (!codeId) {
      return NextResponse.json(
        { error: "codeId is required" },
        { status: 400 }
      );
    }

    // Xóa usage records trước
    await prisma.redeemCodeUsage.deleteMany({
      where: {
        maCode: parseInt(codeId),
      },
    });

    // Xóa code
    await prisma.redeemCode.delete({
      where: { id: parseInt(codeId) },
    });

    return NextResponse.json({ message: "Redeem code deleted" });
  } catch (error) {
    console.error("Error deleting redeem code:", error);
    return NextResponse.json(
      { error: "Failed to delete redeem code" },
      { status: 500 }
    );
  }
}
