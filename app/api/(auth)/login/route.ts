
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

        // Lấy thông tin người dùng
        const user = await prisma.nguoiDungs.findFirst({ where: { tk: taiKhoan } });

        if (!user) {
            return NextResponse.json({ error: "Không tìm thấy thông tin người dùng" }, { status: 404 });
        }

        // Tạo cookie phiên đăng nhập đơn giản
        const res = NextResponse.json({
            message: "Đăng nhập thành công",
            user: {
                id: user.id,
                tk: taiKhoan,
                tenNguoiDung: user.tenNguoiDung || taiKhoan,
                email: user.email,
            }
        }, { status: 200 });

        res.cookies.set("session", JSON.stringify({
            userId: user.id,
            tk: taiKhoan,
            tenNguoiDung: user.tenNguoiDung || taiKhoan,
        }), {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            sameSite: "lax",
        });

        return res;
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Yêu cầu không phù hợp" }, { status: 500 })
    }
}