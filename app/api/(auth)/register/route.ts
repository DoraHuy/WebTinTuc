import { prisma } from "@/lib/prisma";
import { RegisterBody } from "@/validate/validationAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const validation = await RegisterBody.safeParse(data)

        if (!validation.success) {
            return NextResponse.json({ error: "Lỗi nhập sai dữ liệu", details: validation.error }, { status: 400 })
        }

        const { taiKhoan, email, password } = await validation.data;

        // Kiểm tra tồn tại
        const existed = await prisma.taiKhoan.findUnique({ where: { taiKhoan } });
        const existedEmail = await prisma.nguoiDungs.findUnique({ where: { email } });
        if (existed || existedEmail) {
            return NextResponse.json({ error: "Tài khoản hoặc email đã tồn tại" }, { status: 400 });
        }

        // Tạo tài khoản + người dùng liên kết
        const newUserAdmin = await prisma.taiKhoan.create({
            data: {
                taiKhoan,
                matKhau: password,
                nguoiDung: {
                    create: {
                        tenNguoiDung: taiKhoan,
                        email,
                        // Không set `tk` ở nested create; Prisma tự liên kết qua relation
                    },
                },
            },
            include: {
                nguoiDung: true,
            },
        });

        return NextResponse.json({ message: "Tạo mới thành công", user: newUserAdmin }, { status: 201 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 })
    }
}