import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const data = await prisma.tinTucs.findMany({
            select: {
                id: true,
                tenTinTuc: true,
                tomTat: true,
                thoiGianDang: true,

                nguoiDung: {
                    select: {
                        tenNguoiDung: true
                    }
                },

                danhMuc: {
                    select: {
                        id: true,
                        tenDanhMuc: true
                    }
                }
            },
            orderBy: {
                thoiGianDang: 'desc'
            }
        })

        return NextResponse.json(data, { status: 200, statusText: "lay thanh cong" });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Lấy không thành công" }, { status: 500 });
    }
}