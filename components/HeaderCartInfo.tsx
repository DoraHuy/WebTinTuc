"use client";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function HeaderCartInfo() {
  const { data } = useSWR("/api/cart", fetcher);
  const count = Array.isArray(data?.items) ? data.items.length : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm">Đã đăng nhập</span>
      <Link href="/cart" className="px-3 py-1 rounded bg-muted hover:bg-muted/80">Giỏ hàng ({count})</Link>
      <form action="/api/auth/logout" method="post">
        <button className="px-3 py-1 rounded bg-destructive text-destructive-foreground">Đăng xuất</button>
      </form>
    </div>
  );
}
