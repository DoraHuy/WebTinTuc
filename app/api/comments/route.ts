import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

// GET: /api/comments?postId=123
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const postIdParam = searchParams.get("postId");
  const postId = postIdParam ? Number(postIdParam) : NaN;
  if (!postId) return NextResponse.json({ comments: [] }, { status: 200 });

  const comments = await prisma.binhLuans.findMany({
    where: { maTinTuc: postId },
    include: { nguoiDung: true },
    orderBy: { ngayBinhLuan: "desc" },
  });

  return NextResponse.json({ comments }, { status: 200 });
}

// POST: body { postId: number, content: string }
export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  const body = await req.json();
  const { postId, content } = body || {};
  if (!postId || typeof postId !== "number" || !content || typeof content !== "string") {
    return NextResponse.json({ error: "Thiếu dữ liệu" }, { status: 400 });
  }

  const created = await prisma.binhLuans.create({
    data: {
      noiDungBinhLuan: content,
      maNguoiDung: session.userId,
      maTinTuc: postId,
      trangThaiAnDanh: false,
      tenNguoiBinhLuan: undefined,
    },
  });

  return NextResponse.json({ comment: created }, { status: 201 });
}
