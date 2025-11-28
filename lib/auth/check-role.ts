import { prisma } from "@/lib/prisma";
import { getSession } from "./session";

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  try {
    const user = await prisma.nguoiDungs.findUnique({
      where: { id: session.userId },
      include: {
        nguoiDungVaiTro: {
          where: { trangThai: true },
          include: {
            vaiTro: true,
          },
        },
      },
    });

    if (!user) return false;

    // Kiểm tra có vai trò admin không (tên vai trò chứa 'admin' hoặc id = 1)
    return user.nguoiDungVaiTro.some(
      (role) =>
        role.vaiTro.tenVaiTro.toLowerCase().includes("admin") ||
        role.vaiTro.id === 1
    );
  } catch (error) {
    console.error("Error checking admin role:", error);
    return false;
  }
}

export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }
  return true;
}
