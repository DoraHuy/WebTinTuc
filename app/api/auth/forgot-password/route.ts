import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Tạo transporter email (sử dụng Gmail hoặc SMTP service khác)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, SDT } = body;

    if (!email && !SDT) {
      return NextResponse.json(
        { error: 'Vui lòng cung cấp email hoặc SDT' },
        { status: 400 }
      );
    }

    // Tìm người dùng
    const user = await prisma.nguoiDungs.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { SDT: SDT || undefined },
        ].filter(obj => Object.values(obj)[0] !== undefined),
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Tài khoản không tồn tại' },
        { status: 404 }
      );
    }

    // Tạo mã reset ngẫu nhiên (6 chữ số)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    // Lưu reset code vào database
    // Thêm trường này vào schema nếu chưa có
    // Tạm thời, ta có thể lưu vào một temporary collection hoặc cache
    // Hoặc thêm 2 trường vào NguoiDungs: resetCode, resetCodeExpiry

    // Gửi email
    try {
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: user.email,
        subject: 'Mã Xác Nhận Đặt Lại Mật Khẩu - TechNews',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #333;">Xác Nhận Đặt Lại Mật Khẩu</h2>
            <p>Xin chào <strong>${user.tenNguoiDung}</strong>,</p>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Sử dụng mã bên dưới:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h1 style="color: #007bff; letter-spacing: 2px; margin: 0;">${resetCode}</h1>
            </div>
            <p style="color: #666;">Mã này có hiệu lực trong 15 phút.</p>
            <p style="color: #666;">Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
            <p style="color: #999; font-size: 12px;">© 2024 TechNews. Mọi quyền được bảo lưu.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Không trả về lỗi cho người dùng, tiếp tục với code đã tạo
    }

    // Lưu reset code vào cache hoặc database
    // Tạm thời sử dụng một biến global (không nên dùng trong production)
    // Trong production, sử dụng Redis hoặc thêm trường vào database

    // Lưu vào session hoặc Redis
    // Để đơn giản, ta sẽ lưu vào một Map trong memory (chỉ hoạt động trong development)
    if (!global.resetCodes) {
      global.resetCodes = new Map();
    }
    global.resetCodes.set(user.id, {
      code: resetCode,
      expiry: resetTokenExpiry.getTime(),
    });

    return NextResponse.json({
      email: user.email,
      message: 'Mã xác nhận đã được gửi đến email của bạn',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
