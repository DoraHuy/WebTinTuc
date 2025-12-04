import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/check-role";

// GET: Lấy danh sách bài viết chờ duyệt
export async function GET() {
    try {
        // Tạm thời bỏ kiểm tra admin để test
        // const admin = await isAdmin();
        // if (!admin) {
        //     return NextResponse.json(
        //         { error: "Không có quyền truy cập" },
        //         { status: 403 }
        //     );
        // }

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
        // Tạm thời bỏ kiểm tra admin để test
        // const admin = await isAdmin();
        // if (!admin) {
        //     return NextResponse.json(
        //         { error: "Không có quyền truy cập" },
        //         { status: 403 }
        //     );
        // }

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
        // BƯỚC 1: Tạo bài viết mới vào bảng TinTucs
        const newPost = await prisma.tinTucs.create({
            data: {
                tenTinTuc: submission.tieuDe,
                noiDungTinTuc: submission.noiDung,
                tomTat: submission.noiDung.substring(0, 200), // Tóm tắt 200 ký tự đầu
                maNguoiDung: submission.maNguoiDung,
                isPremium: submission.isPremium,
                gia: submission.isPremium ? 10000 : 0, // Bài premium mặc định 10k
                trangThaiDuyet: true,
                ngayDang: new Date(),
            },
        });

        // BƯỚC 2: Tạo mã code cho mọi bài viết (cả FREE và PREMIUM)
        const generateCode = () => {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let code = "";
            for (let i = 0; i < 10; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        };

        let redeemCode = generateCode();
        
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

        // Tạo redeem code - chỉ mở được bài này, dùng 1 lần
        const newCode = await prisma.redeemCode.create({
            data: {
                code: redeemCode,
                loaiCode: "single_post", // Chỉ cho 1 bài cụ thể
                giaTri: newPost.id, // ID của bài viết được mở
                soLanDung: 1, // Chỉ dùng 1 lần
                nguoiTao: submission.maNguoiDung,
            },
        });
        const newCodeId = newCode.id;

        // BƯỚC 3: Cập nhật submission
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
            message: "Đã duyệt bài viết và tạo mã code (dùng 1 lần)",
            code: redeemCode,
            postId: newPost.id, // ID bài viết mới tạo
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
