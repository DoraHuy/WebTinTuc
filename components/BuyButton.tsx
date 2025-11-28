"use client";

import { useState } from "react";
import { ShoppingCart, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface BuyButtonProps {
  postId: number;
  price: number;
  isPremium: boolean;
  hasAccess?: boolean;
}

export default function BuyButton({
  postId,
  price,
  isPremium,
  hasAccess = false,
}: BuyButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  if (!isPremium || hasAccess) {
    return null;
  }

  const handleAddToCart = async () => {
    // Kiểm tra đăng nhập
    const checkAuth = await fetch('/api/auth/me');
    if (!checkAuth.ok) {
      setMessage('⚠️ Vui lòng đăng nhập để thêm vào giỏ hàng');
      setTimeout(() => {
        window.location.href = '/login?redirect=/posts/' + postId;
      }, 1500);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Đã thêm vào giỏ hàng!");
        setTimeout(() => {
          router.push("/cart");
        }, 1000);
      } else {
        setMessage(data.error || "Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      setMessage("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    // Kiểm tra đăng nhập
    const checkAuth = await fetch('/api/auth/me');
    if (!checkAuth.ok) {
      setMessage('⚠️ Vui lòng đăng nhập để mua bài viết');
      setTimeout(() => {
        window.location.href = '/login?redirect=/posts/' + postId;
      }, 1500);
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const userData = await checkAuth.json();
      const userId = userData.id;
      const res = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ ${data.message || 'Mua thành công!'} Số dư mới: ${data.newBalance?.toLocaleString('vi-VN')}đ`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setMessage(data.error || 'Không thể mua bài viết');
      }
    } catch {
      setMessage('Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="font-semibold text-yellow-800 dark:text-yellow-300">
              Bài viết Premium
            </span>
          </div>
          <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {price.toLocaleString("vi-VN")} đ
          </span>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
          Mua bài viết này để đọc toàn bộ nội dung chi tiết
        </p>
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          {loading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
        </button>

        <button
          onClick={handlePurchase}
          disabled={loading}
          className="mt-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mua ngay
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.includes("thành công") || message.includes("Đã thêm")
              ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
