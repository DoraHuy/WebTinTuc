import { prisma } from "@/lib/prisma";
import { LoginBody } from "@/validate/validationAuth";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Thêm import bcrypt

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        // Validate dữ liệu đầu vào
        const dataValidation = LoginBody.safeParse(data);

        if (!dataValidation.success) {
            return NextResponse.json({ error: "Lỗi định dạng dữ liệu" }, { status: 400 })
        }

        const { taiKhoan, password } = dataValidation.data;

        // BƯỚC 1: Tìm tài khoản trong database trước
        const admin = await prisma.taiKhoan.findUnique({
            where: {
                taiKhoan: taiKhoan,
            }
        });

        // Nếu không tìm thấy tài khoản
        if (!admin) {
            return NextResponse.json("Tài khoản không tồn tại", { status: 400 })
        }

        // BƯỚC 2: So sánh mật khẩu nhập vào với mật khẩu đã mã hóa trong DB
        // bcrypt.compare(password_nhập_vào, password_trong_db)
        const isPasswordValid = await bcrypt.compare(password, admin.matKhau);

        if (!isPasswordValid) {
            return NextResponse.json("Mật khẩu không đúng", { status: 400 })
        }

        // Đăng nhập thành công (Ở đây bạn có thể tạo Token/Session nếu cần)
        return NextResponse.json("Đăng nhập thành công", { status: 200 })

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Lỗi hệ thống" }, { status: 500 })
    }
}