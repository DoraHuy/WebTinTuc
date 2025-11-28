import { cookies } from "next/headers";

export interface SessionData {
  userId: number;
  tk: string;
  tenNguoiDung?: string;
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const store = await cookies();
    const value = store.get("session")?.value;
    if (!value) return null;
    const parsed = JSON.parse(value);
    if (typeof parsed?.userId !== "number" || typeof parsed?.tk !== "string") return null;
    return parsed as SessionData;
  } catch {
    return null;
  }
}
