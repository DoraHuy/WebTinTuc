import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// GET: Lấy danh sách bài viết chờ duyệt
export async function GET() {
    try {
        const pendingPosts = await prisma.postSubmission.findMany({
            where: {
                trangThai: "pending",
            },
            include: {
                nguoiDung: true,
            },
            orderBy: {
                ngayGui: "desc",
            },
        });

        return NextResponse.json({ posts: pendingPosts });
    } catch (error) {
        console.error("Error fetching pending posts:", error);
        return NextResponse.json(
            { error: "Lỗi khi lấy danh sách bài viết" },
            { status: 500 }
        );
    }
}

// POST: Duyệt bài viết và tạo mã code
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { submissionId, nguoiDuyet, ghiChu, action } = body;

        if (!submissionId || !nguoiDuyet || !action) {
            return NextResponse.json(
                { error: "Thiếu thông tin" },
                { status: 400 }
            );
        }

        const submission = await prisma.postSubmission.findUnique({
            where: { id: submissionId },
        });

        if (!submission) {
            return NextResponse.json(
                { error: "Không tìm thấy bài viết" },
                { status: 404 }
            );
        }

        if (action === "reject") {
            // Từ chối bài viết
            await prisma.postSubmission.update({
                where: { id: submissionId },
                data: {
                    trangThai: "rejected",
                    nguoiDuyet,
                    ngayDuyet: new Date(),
                    ghiChu: ghiChu || "Bài viết không đạt yêu cầu",
                },
            });

            return NextResponse.json({
                message: "Đã từ chối bài viết",
            });
        }

        // Duyệt bài viết
        // CHỈ tạo mã code nếu bài viết là FREE (không phải premium)
        let redeemCode = null;
        let newCodeId = null;

        if (!submission.isPremium) {
            // Bài FREE sẽ nhận được mã code
            const generateCode = () => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                let code = "";
                for (let i = 0; i < 10; i++) {
                    code += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return code;
            };

            redeemCode = generateCode();
            
            // Kiểm tra trùng code
            let existingCode = await prisma.redeemCode.findUnique({
                where: { code: redeemCode },
            });

            while (existingCode) {
                redeemCode = generateCode();
                existingCode = await prisma.redeemCode.findUnique({
                    where: { code: redeemCode },
                });
            }

            // Tạo redeem code - cho phép đọc BẤT KỲ bài premium nào
            const newCode = await prisma.redeemCode.create({
                data: {
                    code: redeemCode,
                    loaiCode: "unlimited", // Code dùng nhiều lần
                    giaTri: 0, // Không giới hạn
                    soLanDung: 999999, // Dùng nhiều lần
                    nguoiTao: submission.maNguoiDung,
                },
            });
            newCodeId = newCode.id;
        }

        // Cập nhật submission
        await prisma.postSubmission.update({
            where: { id: submissionId },
            data: {
                trangThai: "approved",
                nguoiDuyet,
                ngayDuyet: new Date(),
                maCodeTao: newCodeId,
                ghiChu: ghiChu || "Bài viết đã được duyệt",
            },
        });

        return NextResponse.json({
            message: submission.isPremium 
                ? "Đã duyệt bài viết premium (không tạo code)"
                : "Đã duyệt bài viết FREE và tạo mã code đọc premium",
            code: redeemCode,
            submission: { id: submissionId, isPremium: submission.isPremium },
        });
    } catch (error) {
        console.error("Error approving post:", error);
        return NextResponse.json(
            { error: "Lỗi khi duyệt bài viết" },
            { status: 500 }
        );
    }
}
