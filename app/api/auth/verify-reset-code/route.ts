import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email và mã xác nhận là bắt buộc' },
        { status: 400 }
      );
    }

    // Tìm người dùng
    const user = await prisma.nguoiDungs.findUnique({
      where: { email },
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

    return NextResponse.json({
      message: 'Mã xác nhận hợp lệ',
      userId: user.id,
    });
  } catch (error) {
    console.error('Verify reset code error:', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
