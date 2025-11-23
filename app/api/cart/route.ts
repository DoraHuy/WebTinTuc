import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// GET - Lấy giỏ hàng của người dùng
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

    const cartItems = await prisma.cart.findMany({
      where: {
        maNguoiDung: parseInt(userId),
      },
      include: {
        tinTuc: {
          include: {
            nguoiDung: true,
            danhMuc: true,
            tags: true,
          },
        },
      },
      orderBy: {
        ngayThem: "desc",
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - Thêm bài viết vào giỏ hàng
export async function POST(req: NextRequest) {
  try {
    const { userId, postId } = await req.json();

    if (!userId || !postId) {
      return NextResponse.json(
        { error: "userId and postId are required" },
        { status: 400 }
      );
    }

    // Kiểm tra bài viết có tồn tại và là premium không
    const post = await prisma.tinTucs.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    if (!post.isPremium) {
      return NextResponse.json(
        { error: "This post is not premium" },
        { status: 400 }
      );
    }

    // Kiểm tra xem người dùng đã mua bài viết này chưa
    const purchased = await prisma.purchasedPost.findUnique({
      where: {
        maNguoiDung_maTinTuc: {
          maNguoiDung: parseInt(userId),
          maTinTuc: parseInt(postId),
        },
      },
    });

    if (purchased) {
      return NextResponse.json(
        { error: "You already purchased this post" },
        { status: 400 }
      );
    }

    // Kiểm tra xem bài viết đã có trong giỏ hàng chưa
    const existingItem = await prisma.cart.findUnique({
      where: {
        maNguoiDung_maTinTuc: {
          maNguoiDung: parseInt(userId),
          maTinTuc: parseInt(postId),
        },
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Post already in cart" },
        { status: 400 }
      );
    }

    // Thêm vào giỏ hàng
    const cartItem = await prisma.cart.create({
      data: {
        maNguoiDung: parseInt(userId),
        maTinTuc: parseInt(postId),
      },
      include: {
        tinTuc: {
          include: {
            nguoiDung: true,
            danhMuc: true,
            tags: true,
          },
        },
      },
    });

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa bài viết khỏi giỏ hàng
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const postId = searchParams.get("postId");

    if (!userId || !postId) {
      return NextResponse.json(
        { error: "userId and postId are required" },
        { status: 400 }
      );
    }

    await prisma.cart.delete({
      where: {
        maNguoiDung_maTinTuc: {
          maNguoiDung: parseInt(userId),
          maTinTuc: parseInt(postId),
        },
      },
    });

    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
