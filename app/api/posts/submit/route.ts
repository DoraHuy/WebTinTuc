import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// POST: Gửi bài viết mới để đọc (chờ duyệt)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tieuDe, noiDung, hinhAnh, isPremium, maNguoiDung } = body;

        if (!tieuDe || !noiDung || !maNguoiDung) {
            return NextResponse.json(
                { error: "Thiếu thông tin bài viết" },
                { status: 400 }
            );
        }

        const postSubmission = await prisma.postSubmission.create({
            data: {
                tieuDe,
                noiDung,
                hinhAnh: hinhAnh || null,
                isPremium: isPremium || false,
                maNguoiDung,
                trangThai: "pending",
            },
        });

        return NextResponse.json({
            message: "Gửi bài viết thành công! Vui lòng chờ admin duyệt.",
            submission: postSubmission,
        });
    } catch (error) {
        console.error("Error submitting post:", error);
        return NextResponse.json(
            { error: "Lỗi khi gửi bài viết" },
            { status: 500 }
        );
    }
}

// GET: Lấy danh sách bài viết của người dùng
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { error: "Thiếu userId" },
                { status: 400 }
            );
        }

        const submissions = await prisma.postSubmission.findMany({
            where: {
                maNguoiDung: parseInt(userId),
            },
            orderBy: {
                ngayGui: "desc",
            },
        });

        return NextResponse.json({ submissions });
    } catch (error) {
        console.error("Error fetching submissions:", error);
        return NextResponse.json(
            { error: "Lỗi khi lấy danh sách bài viết" },
            { status: 500 }
        );
    }
}
