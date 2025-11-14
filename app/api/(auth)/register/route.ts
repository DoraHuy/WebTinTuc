import { prisma } from "@/lib/prisma";
import { RegisterBody } from "@/validate/validationAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const validation = await RegisterBody.safeParse(data)

        if (!validation.success) {
            return NextResponse.json(validation.error, { status: 400, statusText: "Lỗi nhập sai dữ liệu" })
        }

        const { taiKhoan, email, password } = await validation.data;

        const newUserAdmin = await prisma.taiKhoan.create({
            data: {
                taiKhoan: taiKhoan,
                matKhau: password,
                NguoiDungs: {
                    create: {
                        email: email
                    }
                }
            },
            include: {
                NguoiDungs: true
            }
        })

        return NextResponse.json(newUserAdmin, { status: 201, statusText: "Tạo mới thành công" })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
    }
}