import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// GET - Kiểm tra quyền truy cập bài viết premium
export async function GET(req: NextRequest) {
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

    // Kiểm tra bài viết có tồn tại không
    const post = await prisma.tinTucs.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Nếu không phải premium thì cho phép truy cập
    if (!post.isPremium) {
      return NextResponse.json({
        hasAccess: true,
        reason: "free",
      });
    }

    // Kiểm tra đã mua chưa
    const purchased = await prisma.purchasedPost.findUnique({
      where: {
        maNguoiDung_maTinTuc: {
          maNguoiDung: parseInt(userId),
          maTinTuc: parseInt(postId),
        },
      },
    });

    if (purchased) {
      return NextResponse.json({
        hasAccess: true,
        reason: "purchased",
        purchaseDate: purchased.ngayMua,
      });
    }

    return NextResponse.json({
      hasAccess: false,
      price: post.gia,
    });
  } catch (error) {
    console.error("Error checking access:", error);
    return NextResponse.json(
      { error: "Failed to check access" },
      { status: 500 }
    );
  }
}

// GET với path /purchased - Lấy danh sách bài viết đã mua
export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const purchasedPosts = await prisma.purchasedPost.findMany({
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
        ngayMua: "desc",
      },
    });

    return NextResponse.json(purchasedPosts);
  } catch (error) {
    console.error("Error fetching purchased posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchased posts" },
      { status: 500 }
    );
  }
}
