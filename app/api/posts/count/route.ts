import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get("categoryId");
        const isPremiumParam = searchParams.get("isPremium");

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

        const count = await prisma.tinTucs.count({ where });

        return NextResponse.json({ count });
    } catch (error) {
        console.error("Error counting posts:", error);
        return NextResponse.json(
            { error: "Lỗi khi đếm bài viết" },
            { status: 500 }
        );
    }
}
