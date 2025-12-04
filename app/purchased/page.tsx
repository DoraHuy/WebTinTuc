"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Calendar, User } from "lucide-react";

interface PurchasedPost {
  id: number;
  ngayMua: string;
  gia: number;
  tinTuc: {
    id: number;
    tenTinTuc: string;
    tomTat: string | null;
    ngayDang: string;
    nguoiDung: {
      tenNguoiDung: string;
    };
    danhMuc: Array<{
      tenDanhMuc: string;
    }>;
  };
}

export default function PurchasedPostsPage() {
  const [posts, setPosts] = useState<PurchasedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserId();
  }, []);

  const fetchUserId = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUserId(data.user.userId);
          fetchPurchasedPosts(data.user.userId);
        } else {
          window.location.href = "/login";
        }
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      window.location.href = "/login";
    }
  };

  const fetchPurchasedPosts = async (uid: number) => {
    try {
      const res = await fetch("/api/purchased", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: uid }),
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching purchased posts:", error);
    } finally {
      setLoading(false);
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
            <Lock className="w-8 h-8 mr-3 text-blue-600" />
            Bài viết đã mua
          </h1>
          <a href="/" className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Trang chủ
          </a>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              Bạn chưa mua bài viết nào
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Khám phá bài viết premium
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                onClick={() => router.push(`/posts/${item.tinTuc.id}`)}
              >
                <div className="p-6">
                  {/* Category Badge */}
                  {item.tinTuc.danhMuc.length > 0 && (
                    <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-semibold rounded-full mb-3">
                      {item.tinTuc.danhMuc[0].tenDanhMuc}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-lg font-bold mb-3 line-clamp-2 hover:text-blue-600 transition">
                    {item.tinTuc.tenTinTuc}
                  </h3>

                  {/* Summary */}
                  {item.tinTuc.tomTat && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {item.tinTuc.tomTat}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      <span>{item.tinTuc.nguoiDung.tenNguoiDung}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Mua ngày{" "}
                        {new Date(item.ngayMua).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Đã thanh toán
                  </span>
                  <span className="font-bold text-green-600">
                    {item.gia === 0 ? "Miễn phí" : `${item.gia.toLocaleString("vi-VN")} đ`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {posts.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Tổng số bài viết đã mua
                </p>
                <p className="text-3xl font-bold text-blue-600">{posts.length}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600 dark:text-gray-400 mb-1">
                  Tổng chi tiêu
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {posts
                    .reduce((sum, item) => sum + item.gia, 0)
                    .toLocaleString("vi-VN")}{" "}
                  đ
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
