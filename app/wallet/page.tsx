"use client";

import { useState, useEffect } from "react";
import { Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Transaction {
  id: number;
  loaiGD: string;
  soTien: number;
  moTa: string | null;
  ngayGD: string;
}

interface WalletInfo {
  id: number;
  soDu: number;
  transactions: Transaction[];
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (data.authenticated && data.user?.userId) {
        setUserId(data.user.userId);
        fetchWallet(data.user.userId);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/login");
    }
  };

  const fetchWallet = async (uid: number) => {
    try {
      const res = await fetch(`/api/wallet?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setWallet(data);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!userId || !depositAmount) return;

    const amount = parseInt(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: "error", text: "Số tiền không hợp lệ" });
      return;
    }

    setProcessing(true);
    setMessage(null);

    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount,
          method: "bank_transfer",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Nạp tiền thành công!" });
        setDepositAmount("");
        setShowDeposit(false);
        fetchWallet(userId);
      } else {
        setMessage({ type: "error", text: data.error || "Nạp tiền thất bại" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra khi nạp tiền" });
    } finally {
      setProcessing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === "deposit") {
      return <ArrowDownRight className="w-5 h-5 text-green-600" />;
    }
    return <ArrowUpRight className="w-5 h-5 text-red-600" />;
  };

  const getTransactionColor = (type: string) => {
    if (type === "deposit") {
      return "text-green-600";
    }
    return "text-red-600";
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <WalletIcon className="w-8 h-8 mr-3 text-blue-600" />
            Ví của tôi
          </h1>
          <a href="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Trang chủ
          </a>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-200 text-sm mb-2">Số dư hiện tại</p>
              <p className="text-4xl font-bold">
                {wallet?.soDu.toLocaleString("vi-VN")} đ
              </p>
            </div>
            <WalletIcon className="w-12 h-12 text-blue-300" />
          </div>
          <button
            onClick={() => setShowDeposit(!showDeposit)}
            className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nạp tiền
          </button>
        </div>

        {/* Deposit Form */}
        {showDeposit && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Nạp tiền vào ví</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Số tiền (VNĐ)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[10000, 50000, 100000, 500000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDepositAmount(amount.toString())}
                    className="py-2 px-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition text-sm"
                  >
                    {(amount / 1000).toLocaleString()}K
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDeposit}
                  disabled={processing || !depositAmount}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? "Đang xử lý..." : "Xác nhận nạp tiền"}
                </button>
                <button
                  onClick={() => setShowDeposit(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-8 ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-6">Lịch sử giao dịch</h2>
          
          {wallet?.transactions && wallet.transactions.length > 0 ? (
            <div className="space-y-3">
              {wallet.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.loaiGD)}
                    <div>
                      <p className="font-medium">
                        {transaction.moTa || "Giao dịch"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.ngayGD).toLocaleString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${getTransactionColor(transaction.loaiGD)}`}>
                    {transaction.loaiGD === "deposit" ? "+" : "-"}
                    {transaction.soTien.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              Chưa có giao dịch nào
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
