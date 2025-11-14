
import { prisma } from "@/lib/prisma";
import { LoginBody } from "@/validate/validationAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const dataValidation = LoginBody.safeParse(data);

        if (!dataValidation.success) {
            return NextResponse.json({ error: "Lỗi định dạng dữ liệu" }, { status: 400 })
        }

        const { taiKhoan, password } = dataValidation.data;

        const tkAdmin = await prisma.taiKhoan.findFirst({
            where: {
                taiKhoan: taiKhoan,
            }
        })

        if (!tkAdmin) {
            return NextResponse.json("Tài khoản hoặc mật khẩu không khớp", { status: 400 })
        }

        const admin = await prisma.taiKhoan.findFirst({
            where: {
                taiKhoan: taiKhoan,
                matKhau: password
            }
        })

        if (!admin) {
            return NextResponse.json("Mật khẩu không khớp", { status: 400 })
        }

        return NextResponse.json("Đăng nhập thành công", { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Yêu cầu không phù hợp" }, { status: 500 })
    }
}