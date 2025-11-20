# Hướng dẫn chạy Web Tin Tức Công Nghệ

## ✨ Tính năng

### 📰 Trang chủ đầy đủ tính năng:
- **Hero Section** với bài viết nổi bật + 4 bài mới nhất
- **Danh mục** ngang có thể cuộn
- **Bộ lọc** theo: Tất cả / Miễn phí / Premium
- **Sắp xếp** theo: Mới nhất / Thịnh hành / Phổ biến
- **Phân trang** đầy đủ với ellipsis
- **Sidebar** với 4 rankings:
  - Top Thịnh hành (tuần/tháng/tất cả)
  - Top Tác giả (số bài viết)
  - Top Tương tác (lượt tương tác)
  - Top Nạp tiền (doanh thu)

### 👑 Bài viết Premium:
- Badge vàng với icon Crown
- 2 loại: Trả tiền hoặc Viết lại 2 bài
- Hiển thị đặc biệt trên giao diện

### 📊 Dữ liệu:
- **20 bài viết** với đầy đủ thông tin
- **5 tác giả** với stats
- **8 danh mục** công nghệ
- **8 tags** phổ biến
- Tất cả lưu trong file JSON: `public/data/homepage-data.json`

## 🚀 Cách chạy

### 1. Cài đặt dependencies:
\`\`\`powershell
npm install
\`\`\`

### 2. Chạy development server:
\`\`\`powershell
npm run dev
\`\`\`

### 3. Mở trình duyệt:
Truy cập: http://localhost:3000 (hoặc port được hiển thị trong terminal)

## 📁 Cấu trúc dữ liệu

### File JSON: `public/data/homepage-data.json`
\`\`\`json
{
  "categories": [...],  // Danh mục
  "tags": [...],        // Tags
  "authors": [...],     // Tác giả với stats
  "posts": [...]        // Bài viết với đầy đủ info
}
\`\`\`

### Functions: `lib/data/homepage-data.ts`
- \`getPosts()\` - Lấy danh sách bài viết với filter
- \`getFeaturedPost()\` - Lấy bài nổi bật
- \`getLatestPosts()\` - Lấy bài mới nhất
- \`getCategories()\` - Lấy danh mục
- \`getTopAuthors()\` - Lấy top tác giả
- \`getTrendingPosts()\` - Lấy bài thịnh hành
- \`getTotalPosts()\` - Đếm tổng bài viết

## 🎨 Components

### Homepage Components (`components/homepage/`):
- \`PostCard.tsx\` - Card bài viết (3 variants)
- \`PremiumBadge.tsx\` - Badge Premium
- \`HeroSection.tsx\` - Hero section
- \`CategoryNav.tsx\` - Navigation danh mục
- \`PostGrid.tsx\` - Grid bài viết
- \`PostFilter.tsx\` - Bộ lọc
- \`PostPagination.tsx\` - Phân trang
- \`Sidebar.tsx\` - Sidebar chính
- \`TopAuthors.tsx\` - Component top authors
- \`TrendingPosts.tsx\` - Component trending

### Types (`lib/types/Homepage.ts`):
- Định nghĩa tất cả types: Post, Author, Category, Tag, etc.

## 🔧 Chỉnh sửa dữ liệu

### Thêm bài viết mới:
Mở file \`public/data/homepage-data.json\`, thêm vào mảng \`posts\`:

\`\`\`json
{
  "id": 21,
  "tenTinTuc": "Tiêu đề bài viết",
  "tomTat": "Tóm tắt ngắn",
  "noiDungTinTuc": "<h2>Nội dung</h2><p>...</p>",
  "ngayDang": "2024-11-19T10:00:00",
  "isPremium": false,
  "viewCount": 0,
  "likeCount": 0,
  "commentCount": 0,
  "authorId": 1,
  "categoryIds": [1, 2],
  "tagIds": [1, 3],
  "thumbnail": "https://..."
}
\`\`\`

### Thêm danh mục:
Thêm vào mảng \`categories\`:
\`\`\`json
{
  "id": 9,
  "tenDanhMuc": "Tên danh mục",
  "moTaDanhMuc": "Mô tả"
}
\`\`\`

### Thêm tác giả:
Thêm vào mảng \`authors\`:
\`\`\`json
{
  "id": 6,
  "tenNguoiDung": "Tên tác giả",
  "email": "email@example.com",
  "totalPosts": 0,
  "totalInteractions": 0,
  "totalRevenue": 0
}
\`\`\`

## 📝 Notes

- Dữ liệu đang được load từ file JSON tĩnh
- Server-side rendering cho SEO tốt hơn
- Client-side interaction cho filter và pagination
- Responsive design cho mobile và desktop
- Dark mode support với next-themes

## 🎯 Next Steps

1. Kết nối với database Prisma thay vì JSON
2. Thêm authentication
3. Thêm tính năng comment
4. Thêm tính năng like/bookmark
5. Thêm trang chi tiết bài viết
6. Thêm trang tác giả
7. Thêm search functionality

Enjoy coding! 🚀
