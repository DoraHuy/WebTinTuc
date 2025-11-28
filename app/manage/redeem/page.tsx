"use client";

import { useState, useEffect } from "react";
import { Gift, Plus, Trash2, ToggleLeft, ToggleRight, Copy, Check } from "lucide-react";

interface RedeemCode {
  id: number;
  code: string;
  loaiCode: string;
  giaTri: number;
  soLanDung: number;
  daDung: number;
  trangThai: boolean;
  ngayTao: string;
  ngayHetHan: string | null;
  usedBy: Array<{
    nguoiDung: {
      tenNguoiDung: string;
    };
    ngayDung: string;
  }>;
}

export default function ManageRedeemCodesPage() {
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    loaiCode: "single_post",
    giaTri: "",
    soLanDung: "1",
    ngayHetHan: "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Redeem code usage state
  const [redeemCode, setRedeemCode] = useState("");
  const [redeemLoading, setRedeemLoading] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState<{ type: "success" | "error"; text: string; postId?: number } | null>(null);

  useEffect(() => {
    // TODO: Get userId from session/auth
    const mockUserId = 1; // Replace with actual auth
    setUserId(mockUserId);
    fetchCodes(mockUserId);
  }, []);

  const fetchCodes = async (uid: number) => {
    try {
      const res = await fetch(`/api/manage/redeem?userId=${uid}`);
      if (res.ok) {
        const data = await res.json();
        setCodes(data);
      }
    } catch (error) {
      console.error("Error fetching codes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async () => {
    if (!userId || !formData.giaTri) {
      setMessage({ type: "error", text: "Vui lòng điền đầy đủ thông tin" });
      return;
    }

    try {
      const res = await fetch("/api/manage/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          ...formData,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Tạo mã thành công!" });
        setShowCreateForm(false);
        setFormData({
          loaiCode: "single_post",
          giaTri: "",
          soLanDung: "1",
          ngayHetHan: "",
        });
        fetchCodes(userId);
      } else {
        setMessage({ type: "error", text: data.error || "Tạo mã thất bại" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Có lỗi xảy ra" });
    }
  };

  const handleToggleStatus = async (codeId: number, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/manage/redeem", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codeId,
          trangThai: !currentStatus,
        }),
      });

      if (res.ok) {
        setCodes(
          codes.map((code) =>
            code.id === codeId ? { ...code, trangThai: !currentStatus } : code
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleDeleteCode = async (codeId: number) => {
    if (!confirm("Bạn có chắc muốn xóa mã này?")) return;

    try {
      const res = await fetch(`/api/manage/redeem?codeId=${codeId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCodes(codes.filter((code) => code.id !== codeId));
        setMessage({ type: "success", text: "Đã xóa mã" });
      }
    } catch (error) {
      console.error("Error deleting code:", error);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeemCode = async () => {
    if (!redeemCode.trim()) {
      setRedeemMessage({ type: "error", text: "Vui lòng nhập mã redeem" });
      return;
    }

    // Check authentication
    const checkAuth = await fetch('/api/auth/me');
    if (!checkAuth.ok) {
      setRedeemMessage({ type: "error", text: "⚠️ Vui lòng đăng nhập để sử dụng mã redeem" });
      setTimeout(() => {
        window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
      }, 1500);
      return;
    }

    const authData = await checkAuth.json();
    const currentUserId = authData.id;

    setRedeemLoading(true);
    setRedeemMessage(null);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUserId,
          code: redeemCode.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.result.type === "post") {
          setRedeemMessage({
            type: "success",
            text: `✅ Sử dụng mã thành công! Bạn đã được quyền đọc bài: "${data.result.value}"`,
            postId: data.result.postId,
          });
          setRedeemCode("");
          // Reload codes list in case it was created by this user
          if (userId) fetchCodes(userId);
        } else if (data.result.type === "balance") {
          setRedeemMessage({
            type: "success",
            text: `✅ Nạp tiền thành công! Bạn đã nhận ${data.result.value.toLocaleString("vi-VN")} đ vào ví`,
          });
          setRedeemCode("");
        } else if (data.result.type === "unlimited") {
          setRedeemMessage({
            type: "success",
            text: `🎉 ${data.result.message} Bạn có thể đọc TẤT CẢ bài premium!`,
          });
          setRedeemCode("");
        }
      } else {
        setRedeemMessage({ type: "error", text: data.error || "Có lỗi xảy ra" });
      }
    } catch (error) {
      setRedeemMessage({ type: "error", text: "Có lỗi xảy ra khi sử dụng mã" });
    } finally {
      setRedeemLoading(false);
    }
  };

  const getCodeTypeLabel = (type: string) => {
    switch (type) {
      case "single_post":
        return "Bài viết đơn";
      case "unlimited":
        return "Không giới hạn";
      case "balance":
        return "Nạp tiền";
      default:
        return type;
    }
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
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Gift className="w-8 h-8 mr-3 text-purple-600" />
            Quản lý mã Redeem
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Tạo mã mới
            </button>
            <a href="/" className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Trang chủ
            </a>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Use Redeem Code Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow p-6 mb-8 border-2 border-purple-200 dark:border-purple-700">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Gift className="w-6 h-6 mr-2 text-purple-600" />
            Sử dụng mã Redeem
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Nhập mã để mở khóa bài viết premium hoặc nhận tiền vào ví
          </p>
          
          {redeemMessage && (
            <div
              className={`p-4 rounded-lg mb-4 ${
                redeemMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
              }`}
            >
              {redeemMessage.text}
              {redeemMessage.postId && (
                <div className="mt-2">
                  <a
                    href={`/posts/${redeemMessage.postId}`}
                    className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                  >
                    📖 Đọc bài ngay
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={redeemCode}
              onChange={(e) => setRedeemCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleRedeemCode()}
              placeholder="Nhập mã redeem..."
              disabled={redeemLoading}
              className="flex-1 px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 disabled:opacity-50 font-mono"
            />
            <button
              onClick={handleRedeemCode}
              disabled={redeemLoading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {redeemLoading ? "Đang xử lý..." : "Sử dụng mã"}
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Tạo mã Redeem mới</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Loại mã</label>
                <select
                  value={formData.loaiCode}
                  onChange={(e) =>
                    setFormData({ ...formData, loaiCode: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="single_post">Bài viết đơn</option>
                  <option value="balance">Nạp tiền</option>
                  <option value="unlimited">Không giới hạn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {formData.loaiCode === "single_post"
                    ? "ID Bài viết"
                    : "Số tiền (VNĐ)"}
                </label>
                <input
                  type="number"
                  value={formData.giaTri}
                  onChange={(e) =>
                    setFormData({ ...formData, giaTri: e.target.value })
                  }
                  placeholder={
                    formData.loaiCode === "single_post" ? "ID bài viết" : "Số tiền"
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Số lần dùng</label>
                <input
                  type="number"
                  value={formData.soLanDung}
                  onChange={(e) =>
                    setFormData({ ...formData, soLanDung: e.target.value })
                  }
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ngày hết hạn (tùy chọn)
                </label>
                <input
                  type="date"
                  value={formData.ngayHetHan}
                  onChange={(e) =>
                    setFormData({ ...formData, ngayHetHan: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreateCode}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Tạo mã
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Codes List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mã
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Giá trị
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sử dụng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {codes.map((code) => (
                  <tr key={code.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {code.code}
                        </code>
                        <button
                          onClick={() => copyToClipboard(code.code)}
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {copiedCode === code.code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getCodeTypeLabel(code.loaiCode)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {code.loaiCode === "balance"
                        ? `${code.giaTri.toLocaleString("vi-VN")} đ`
                        : code.giaTri}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {code.daDung} / {code.soLanDung}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(code.id, code.trangThai)}
                        className="flex items-center gap-1"
                      >
                        {code.trangThai ? (
                          <>
                            <ToggleRight className="w-6 h-6 text-green-600" />
                            <span className="text-sm text-green-600">Hoạt động</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-6 h-6 text-gray-400" />
                            <span className="text-sm text-gray-400">Tắt</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDeleteCode(code.id)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {codes.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Chưa có mã nào được tạo
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
