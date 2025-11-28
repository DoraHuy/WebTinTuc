import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 });
  res.cookies.set("session", "", { path: "/", httpOnly: true, maxAge: 0 });
  return res;
}
