"use client";

import { useState } from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  postId: number;
  price?: number;
}

export default function AddToCartButton({ postId, price = 0 }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const router = useRouter();

  const handleAddToCart = async (openAfter = false) => {
    // Kiểm tra đăng nhập
    const checkAuth = await fetch('/api/auth/me');
    if (!checkAuth.ok) {
      setMessage('⚠️ Vui lòng đăng nhập để thêm vào giỏ hàng');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Đã thêm vào giỏ hàng");
        setShowActions(true);
        if (openAfter) router.push("/cart");
      } else {
        setMessage(data.error || "Không thể thêm vào giỏ hàng");
      }
    } catch (e) {
      setMessage("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseNow = async () => {
    // Kiểm tra đăng nhập
    const checkAuth = await fetch('/api/auth/me');
    if (!checkAuth.ok) {
      setMessage('⚠️ Vui lòng đăng nhập để mua bài viết');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const userData = await checkAuth.json();
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: userData.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Mua thành công");
        setTimeout(() => router.refresh(), 800);
      } else {
        setMessage(data.error || "Không thể mua");
      }
    } catch (e) {
      setMessage("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-block">
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAddToCart(false)}
          disabled={loading}
          className="py-1 px-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm flex items-center gap-2 disabled:opacity-60"
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm vào giỏ
        </button>

        <button
          onClick={() => handleAddToCart(true)}
          disabled={loading}
          className="py-1 px-3 bg-primary/90 hover:bg-primary text-primary-foreground rounded-md text-sm flex items-center gap-2 disabled:opacity-60"
        >
          <ArrowRight className="w-4 h-4" />
          Mở giỏ
        </button>
      </div>

      {showActions && (
        <div className="mt-2 p-2 bg-card border rounded-md text-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm">{price ? `${price.toLocaleString('vi-VN')} đ` : '—'}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push('/cart')}
                className="text-xs px-2 py-1 bg-muted rounded"
              >
                Xem giỏ
              </button>
              <button
                onClick={() => router.push('/checkout')}
                className="text-xs px-2 py-1 bg-green-600 text-white rounded"
              >
                Thanh toán
              </button>
              <button
                onClick={handlePurchaseNow}
                disabled={loading}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className="mt-2 text-sm text-muted-foreground">{message}</div>
      )}
    </div>
  );
}
