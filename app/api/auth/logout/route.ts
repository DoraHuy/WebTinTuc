import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    // Xóa tất cả cookies liên quan đến authentication
    const cookieStore = await cookies();
    
    // Danh sách các cookie cần xóa
    const cookiesToDelete = ['session', 'token', 'userId', 'refreshToken', 'accessToken', 'user'];
    
    // Xóa từ server-side
    cookiesToDelete.forEach(name => {
      cookieStore.delete(name);
    });

    // Tạo response với redirect
    const response = NextResponse.json(
      { success: true, message: 'Đăng xuất thành công' },
      { status: 200 }
    );

    // Xóa cookies từ response
    cookiesToDelete.forEach(name => {
      response.cookies.set(name, "", { path: "/", httpOnly: true, maxAge: 0 });
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi đăng xuất' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Danh sách các cookie cần xóa
    const cookiesToDelete = ['session', 'token', 'userId', 'refreshToken', 'accessToken', 'user'];
    
    // Xóa từ server-side
    cookiesToDelete.forEach(name => {
      cookieStore.delete(name);
    });

    // Redirect đến trang login
    const response = NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );

    // Xóa cookies từ response
    cookiesToDelete.forEach(name => {
      response.cookies.set(name, "", { path: "/", httpOnly: true, maxAge: 0 });
    });

    return response;
  } catch (error) {
    console.error('Logout GET error:', error);
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );
  }
}
