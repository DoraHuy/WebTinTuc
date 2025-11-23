import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "10");
        const offset = parseInt(searchParams.get("offset") || "0");
        const categoryId = searchParams.get("categoryId");
        const isPremiumParam = searchParams.get("isPremium");
        const sortBy = searchParams.get("sortBy") || "latest";

        const where: any = {
            trangThaiDuyet: true,
        };

        if (categoryId && categoryId !== "") {
            where.danhMuc = {
                some: { id: parseInt(categoryId) }
            };
        }

        if (isPremiumParam !== "" && isPremiumParam !== null) {
            where.isPremium = isPremiumParam === "true";
        }

        let orderBy: any = { ngayDang: "desc" };
        if (sortBy === "trending" || sortBy === "popular") {
            orderBy = { thoiGianDang: "desc" };
        }

        const posts = await prisma.tinTucs.findMany({
            where,
            orderBy,
            skip: offset,
            take: limit,
            include: {
                nguoiDung: true,
                danhMuc: true,
                tags: true,
            },
        });

        const formattedPosts = posts.map(post => ({
            id: post.id,
            tenTinTuc: post.tenTinTuc,
            tomTat: post.tomTat,
            noiDungTinTuc: post.noiDungTinTuc,
            ngayDang: post.ngayDang,
            isPremium: post.isPremium || false,
            gia: post.gia || 0,
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
            nguoiDung: {
                id: post.nguoiDung.id,
                tenNguoiDung: post.nguoiDung.tenNguoiDung,
                email: post.nguoiDung.email,
            },
            danhMuc: post.danhMuc.map(dm => ({
                id: dm.id,
                tenDanhMuc: dm.tenDanhMuc,
                moTaDanhMuc: dm.moTaDanhMuc,
            })),
            tags: post.tags.map(tag => ({
                id: tag.id,
                tenTag: tag.tenTag,
            })),
            thumbnail: null,
        }));

        return NextResponse.json({ posts: formattedPosts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Lỗi khi lấy danh sách bài viết" },
            { status: 500 }
        );
    }
}
