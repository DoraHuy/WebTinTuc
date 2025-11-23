"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Wallet, Gift } from "lucide-react";

interface CartItem {
  id: number;
  maTinTuc: number;
  tinTuc: {
    id: number;
    tenTinTuc: string;
    gia: number | null;
  };
}

interface WalletInfo {
  soDu: number;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "bank">("wallet");
  const [redeemCode, setRedeemCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // TODO: Get userId from session/auth
    const mockUserId = 1; // Replace with actual auth
    setUserId(mockUserId);
    fetchData(mockUserId);
  }, []);

  const fetchData = async (uid: number) => {
    try {
      const [cartRes, walletRes] = await Promise.all([
        fetch(`/api/cart?userId=${uid}`),
        fetch(`/api/wallet?userId=${uid}`),
      ]);

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setCartItems(cartData);
      }

      if (walletRes.ok) {
        const walletData = await walletRes.json();
        setWallet(walletData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.tinTuc.gia || 0), 0);
  };

  const handleCheckout = async () => {
    if (!userId) return;

    setProcessing(true);
    setMessage(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Thanh toán thành công!" });
        setTimeout(() => {
          router.push("/purchased");
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error || "Thanh toán thất bại" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi thanh toán" });
    } finally {
      setProcessing(false);
    }
  };

  const handleRedeemCode = async () => {
    if (!userId || !redeemCode) return;

    setProcessing(true);
    setMessage(null);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          code: redeemCode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Sử dụng mã thành công!" });
        setRedeemCode("");
        // Refresh data
        fetchData(userId);
      } else {
        setMessage({ type: "error", text: data.error || "Mã không hợp lệ" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi sử dụng mã" });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  const totalPrice = getTotalPrice();
  const canPayWithWallet = wallet && wallet.soDu >= totalPrice;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet Balance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Số dư ví</h2>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Số dư hiện tại:</span>
              <span className="text-2xl font-bold text-green-600">
                {wallet?.soDu.toLocaleString("vi-VN") || 0} đ
              </span>
            </div>
            <button
              onClick={() => router.push("/wallet")}
              className="mt-4 w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition"
            >
              Nạp tiền
            </button>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={paymentMethod === "wallet"}
                  onChange={(e) => setPaymentMethod(e.target.value as "wallet")}
                  className="mr-3"
                  disabled={!canPayWithWallet}
                />
                <Wallet className="w-6 h-6 mr-3 text-blue-600" />
                <div className="flex-1">
                  <div className="font-semibold">Ví điện tử</div>
                  {!canPayWithWallet && (
                    <div className="text-sm text-red-600">Số dư không đủ</div>
                  )}
                </div>
              </label>

              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition opacity-50 cursor-not-allowed">
                <input
                  type="radio"
                  name="payment"
                  value="bank"
                  disabled
                  className="mr-3"
                />
                <CreditCard className="w-6 h-6 mr-3 text-gray-400" />
                <div className="flex-1">
                  <div className="font-semibold">Chuyển khoản ngân hàng</div>
                  <div className="text-sm text-gray-500">Đang phát triển</div>
                </div>
              </label>
            </div>
          </div>

          {/* Redeem Code */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Gift className="w-6 h-6 mr-2 text-purple-600" />
              Mã giảm giá
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={redeemCode}
                onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã giảm giá"
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={handleRedeemCode}
                disabled={!redeemCode || processing}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Áp dụng
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Đơn hàng</h2>
            
            <div className="space-y-3 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="flex-1 line-clamp-1">{item.tinTuc.tenTinTuc}</span>
                  <span className="ml-2 font-semibold">
                    {item.tinTuc.gia?.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">
                  {totalPrice.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={processing || !canPayWithWallet}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </button>

            <button
              onClick={() => router.push("/cart")}
              className="w-full mt-3 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
