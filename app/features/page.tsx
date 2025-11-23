import Link from "next/link";
import {
  ShoppingCart,
  Wallet,
  Gift,
  ShoppingBag,
  CreditCard,
  Settings,
  Home,
  Crown,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      title: "Trang chủ",
      description: "Xem tất cả bài viết và tin tức mới nhất",
      icon: Home,
      link: "/",
      color: "bg-blue-500",
    },
    {
      title: "Giỏ hàng",
      description: "Xem và quản lý các bài viết premium trong giỏ hàng",
      icon: ShoppingCart,
      link: "/cart",
      color: "bg-green-500",
    },
    {
      title: "Thanh toán",
      description: "Thanh toán các bài viết premium trong giỏ hàng",
      icon: CreditCard,
      link: "/checkout",
      color: "bg-purple-500",
    },
    {
      title: "Ví tiền",
      description: "Quản lý số dư và nạp tiền vào ví",
      icon: Wallet,
      link: "/wallet",
      color: "bg-yellow-500",
    },
    {
      title: "Bài viết đã mua",
      description: "Xem thư viện các bài viết premium đã mua",
      icon: ShoppingBag,
      link: "/purchased",
      color: "bg-indigo-500",
    },
    {
      title: "Quản lý mã Redeem",
      description: "Tạo và quản lý mã giảm giá (Admin)",
      icon: Gift,
      link: "/manage/redeem",
      color: "bg-pink-500",
    },
  ];

  const samplePosts = [
    {
      id: 1,
      title: "Bài viết mẫu 1",
      isPremium: false,
    },
    {
      id: 2,
      title: "Bài viết mẫu 2",
      isPremium: true,
    },
    {
      id: 3,
      title: "Bài viết mẫu 3",
      isPremium: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Crown className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hệ Thống E-Commerce
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Hệ thống mua bán bài viết premium hoàn chỉnh với giỏ hàng, thanh toán, ví điện tử và mã giảm giá
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.link}
                href={feature.link}
                className="group block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`${feature.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* How to Use Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Hướng Dẫn Sử Dụng
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Xem bài viết Premium</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Các bài viết premium có icon <Crown className="inline w-4 h-4 text-yellow-500 fill-yellow-500" /> và
                  giá bán. Nhấn vào bài viết để xem chi tiết.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Thêm vào giỏ hàng</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Trong trang chi tiết bài viết premium, nhấn nút "Thêm vào giỏ hàng" màu vàng. Bạn có thể thêm nhiều bài viết.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Nạp tiền vào ví</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Vào trang <strong>Ví tiền</strong>, chọn số tiền muốn nạp (hoặc nhập số tiền tùy ý) và nhấn "Xác nhận nạp tiền".
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Thanh toán</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Vào <strong>Giỏ hàng</strong> → nhấn "Thanh toán" → chọn phương thức "Ví điện tử" → "Xác nhận thanh toán".
                  Bài viết sẽ được thêm vào thư viện của bạn.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                5
              </div>
              <div>
                <h4 className="font-semibold mb-1">Sử dụng mã giảm giá</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Trong trang <strong>Thanh toán</strong>, nhập mã giảm giá vào ô "Mã giảm giá" và nhấn "Áp dụng".
                  Mã có thể tặng bài viết miễn phí hoặc nạp tiền vào ví.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                6
              </div>
              <div>
                <h4 className="font-semibold mb-1">Tạo mã giảm giá (Admin)</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Vào <strong>Quản lý mã Redeem</strong> → nhấn "Tạo mã mới" → chọn loại mã, nhập giá trị, số lần dùng →
                  "Tạo mã". Copy mã và gửi cho người dùng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Posts */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Bài Viết Mẫu</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {samplePosts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 transition-all hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h4>
                  {post.isPremium && (
                    <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {post.isPremium ? "Bài viết Premium" : "Bài viết miễn phí"}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            💡 <strong>Lưu ý:</strong> Hiện tại đang dùng userId mặc định = 1 cho demo
          </p>
          <p>
            🔧 Để sử dụng đầy đủ, cần tích hợp hệ thống đăng nhập và thay thế <code>userId</code> thật
          </p>
        </div>
      </div>
    </div>
  );
}
