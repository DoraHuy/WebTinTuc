import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.danhMucs.findMany({
            select: {
                id: true,
                tenDanhMuc: true,
                moTaDanhMuc: true,
            },
            orderBy: {
                tenDanhMuc: "asc",
            },
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json(
            { error: "Lỗi khi lấy danh mục" },
            { status: 500 }
        );
    }
}
