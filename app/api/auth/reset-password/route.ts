import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, newPassword } = body;

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Email, mã xác nhận và mật khẩu mới là bắt buộc' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Tìm người dùng
    const user = await prisma.nguoiDungs.findUnique({
      where: { email },
      include: {
        tkNguoiDung: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Tài khoản không tồn tại' },
        { status: 404 }
      );
    }

    // Kiểm tra reset code từ global map
    if (!global.resetCodes) {
      return NextResponse.json(
        { error: 'Mã xác nhận không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    const resetData = global.resetCodes.get(user.id);

    if (!resetData) {
      return NextResponse.json(
        { error: 'Mã xác nhận không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      );
    }

    // Kiểm tra hết hạn
    if (Date.now() > resetData.expiry) {
      global.resetCodes.delete(user.id);
      return NextResponse.json(
        { error: 'Mã xác nhận đã hết hạn' },
        { status: 400 }
      );
    }

    // Kiểm tra mã
    if (resetData.code !== code) {
      return NextResponse.json(
        { error: 'Mã xác nhận không đúng' },
        { status: 400 }
      );
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu trong TaiKhoan
    await prisma.taiKhoan.update({
      where: { taiKhoan: user.tk },
      data: {
        matKhau: hashedPassword,
      },
    });

    // Xóa reset code
    global.resetCodes.delete(user.id);

    return NextResponse.json({
      message: 'Mật khẩu đã được đặt lại thành công',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
