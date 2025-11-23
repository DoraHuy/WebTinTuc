"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  maTinTuc: number;
  ngayThem: string;
  tinTuc: {
    id: number;
    tenTinTuc: string;
    tomTat: string | null;
    gia: number | null;
    nguoiDung: {
      tenNguoiDung: string;
    };
  };
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    // TODO: Get userId from session/auth
    const mockUserId = 1; // Replace with actual auth
    setUserId(mockUserId);
    fetchCart(mockUserId);
  }, []);

  const fetchCart = async (uid: number) => {
    try {
      const res = await fetch(`/api/cart?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (postId: number) => {
    if (!userId) return;

    try {
      const res = await fetch(`/api/cart?userId=${userId}&postId=${postId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCartItems(cartItems.filter((item) => item.maTinTuc !== postId));
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.tinTuc.gia || 0), 0);
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng của bạn</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
            Giỏ hàng của bạn đang trống
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {item.tinTuc.tenTinTuc}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Tác giả: {item.tinTuc.nguoiDung.tenNguoiDung}
                  </p>
                  {item.tinTuc.tomTat && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">
                      {item.tinTuc.tomTat}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end justify-between">
                  <p className="text-xl font-bold text-blue-600">
                    {item.tinTuc.gia?.toLocaleString("vi-VN")} đ
                  </p>
                  <button
                    onClick={() => removeFromCart(item.maTinTuc)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Tổng đơn hàng</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Số lượng:
                  </span>
                  <span className="font-semibold">{cartItems.length} bài viết</span>
                </div>
                <div className="border-t dark:border-gray-700 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">
                      {getTotalPrice().toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
