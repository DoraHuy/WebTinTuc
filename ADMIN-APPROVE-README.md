# 📝 Hệ thống Quản Lý & Duyệt Bài

## Tổng quan

Hệ thống quản lý cho phép admin quản lý và phê duyệt các bài viết do người dùng gửi lên. Bao gồm:

- **Dashboard Quản lý**: Tổng quan thống kê hệ thống
- **Duyệt bài viết**: Xem, phê duyệt hoặc từ chối bài viết
- **Quản lý quyền**: Kiểm tra quyền admin trước khi truy cập

## 🚀 Các tính năng

### 1. Dashboard Quản lý (`/manage`)
- Tổng quan số liệu: bài chờ duyệt, đã duyệt, từ chối
- Thống kê người dùng và bài viết
- Thao tác nhanh
- Sidebar navigation với menu đầy đủ

### 2. Duyệt bài viết (`/manage/posts/approve`)

#### Tính năng chính:
- **Lọc bài viết**: Tất cả / Free / Premium
- **Thống kê**: Hiển thị số lượng bài theo loại
- **Preview đầy đủ**: Xem tiêu đề, nội dung, hình ảnh, tác giả
- **Hành động**:
  - ✅ **Duyệt bài**: Phê duyệt và tạo mã code (cho bài Free)
  - ❌ **Từ chối**: Từ chối với lý do cụ thể

#### Quy trình duyệt:

**Bài FREE:**
- Admin duyệt → Hệ thống tạo mã code `unlimited` (dùng nhiều lần)
- Tác giả nhận mã để đọc **BẤT KỲ** bài Premium nào
- Code được lưu vào DB với `loaiCode = 'unlimited'`, `soLanDung = 999999`

**Bài PREMIUM:**
- Admin duyệt → Không tạo mã code
- Bài được đánh dấu `approved` và sẵn sàng bán

## 📁 Cấu trúc file

```
app/
├── manage/
│   ├── layout.tsx                        # Layout với sidebar
│   ├── page.tsx                          # Dashboard trang quản lý
│   ├── (wrapper-sidebar)/
│   │   ├── Wrapper.tsx                   # Wrapper component
│   │   ├── Header.tsx                    # Header quản lý
│   │   └── Sidebar/
│   │       ├── Sidebar.tsx               # Sidebar component
│   │       └── SidebarField.ts           # Sidebar config
│   ├── posts/
│   │   ├── page.tsx                      # Quản lý bài viết
│   │   └── approve/
│   │       └── page.tsx                  # Trang duyệt bài
│   └── redeem/
│       └── page.tsx                      # Quản lý mã giảm giá
├── api/
│   └── manage/
│       ├── post/
│       ├── redeem/
│       └── posts/
│           └── approve/
│               └── route.ts              # API duyệt bài (GET, POST)
lib/
└── auth/
    └── check-role.ts                     # Helper kiểm tra quyền admin
```

## 🔒 Bảo mật

### Kiểm tra quyền Admin
File: `lib/auth/check-role.ts`

```typescript
// Kiểm tra user có vai trò admin không
const admin = await isAdmin();
if (!admin) {
  return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
}
```

**Cơ chế:**
1. Lấy session từ cookie
2. Truy vấn `NguoiDungVaiTro` với `trangThai = true`
3. Kiểm tra `tenVaiTro` chứa "admin" hoặc `id = 1`

## 🎯 API Endpoints

### GET `/api/manage/posts/approve`
Lấy danh sách bài viết chờ duyệt

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "tieuDe": "Tiêu đề bài viết",
      "noiDung": "Nội dung...",
      "hinhAnh": "https://...",
      "isPremium": false,
      "ngayGui": "2025-11-28T...",
      "nguoiDung": {
        "id": 2,
        "tenNguoiDung": "User",
        "email": "user@example.com"
      }
    }
  ]
}
```

### POST `/api/manage/posts/approve`
Duyệt hoặc từ chối bài viết

**Body:**
```json
{
  "submissionId": 1,
  "nguoiDuyet": 1,
  "action": "approve",  // hoặc "reject"
  "ghiChu": "Bài viết đạt yêu cầu"
}
```

**Response (Duyệt bài FREE):**
```json
{
  "message": "Đã duyệt bài viết FREE và tạo mã code đọc premium",
  "code": "ABCD123456",
  "submission": {
    "id": 1,
    "isPremium": false
  }
}
```

## 🗄️ Database Schema

### PostSubmission (Bài chờ duyệt)
```prisma
model PostSubmission {
  id          Int      @id @default(autoincrement())
  tieuDe      String
  noiDung     String   @db.LongText
  hinhAnh     String?
  isPremium   Boolean  @default(false)
  maNguoiDung Int
  nguoiDung   NguoiDungs @relation(...)
  trangThai   String   @default("pending") // pending, approved, rejected
  maCodeTao   Int?     // ID của RedeemCode được tạo
  ngayGui     DateTime @default(now())
  ngayDuyet   DateTime?
  nguoiDuyet  Int?
  ghiChu      String?
}
```

### RedeemCode (Mã thưởng)
```prisma
model RedeemCode {
  id         Int      @id @default(autoincrement())
  code       String   @unique
  loaiCode   String   // "unlimited" cho bài FREE được duyệt
  giaTri     Int      // 0 = không giới hạn
  soLanDung  Int      @default(1)
  daDung     Int      @default(0)
  nguoiTao   Int
  ...
}
```

## 🎨 UI Components

### Admin Layout
- **Sidebar**: Dashboard, Duyệt bài, Quản lý users
- **Header**: Logo admin + link về trang chủ
- **Responsive**: Tương thích mobile/desktop

### Trang Duyệt Bài
- **Statistics Cards**: Tổng số, Free, Premium
- **Filter Buttons**: Lọc theo loại bài
- **Post Cards**: 
  - Avatar + tên tác giả
  - Tiêu đề, nội dung, hình ảnh
  - Badge (Free/Premium)
  - Action buttons (Duyệt/Từ chối)

## 🧪 Testing

### Để test tính năng:

1. **Tạo tài khoản admin** (seed hoặc manual):
```sql
-- Thêm vai trò admin cho user id=1
INSERT INTO NguoiDungVaiTro (maNguoiDung, maVaiTro, ngayNhan, trangThai)
VALUES (1, 1, NOW(), true);
```

2. **Gửi bài viết test**:
```bash
# Gửi bài FREE
curl -X POST http://localhost:3000/api/posts/submit \
  -H "Content-Type: application/json" \
  -d '{
    "tieuDe": "Test bài FREE",
    "noiDung": "Nội dung test...",
    "isPremium": false,
    "maNguoiDung": 2
  }'

# Gửi bài PREMIUM
curl -X POST http://localhost:3000/api/posts/submit \
  -H "Content-Type: application/json" \
  -d '{
    "tieuDe": "Test bài PREMIUM",
    "noiDung": "Nội dung premium...",
    "isPremium": true,
    "maNguoiDung": 2
  }'
```

3. **Truy cập trang quản lý**:
```
http://localhost:3000/manage/posts/approve
```

## 📝 Lưu ý

- **Session**: Cần đăng nhập với tài khoản admin
- **Quyền**: Chỉ user có `VaiTro.id = 1` hoặc tên chứa "admin" mới truy cập được
- **Code Generation**: Chỉ bài FREE được duyệt mới tạo code
- **Code Type**: `unlimited` = dùng nhiều lần, không giới hạn bài nào

## 🔧 Mở rộng

### Thêm tính năng:
- [ ] Phân trang danh sách bài viết
- [ ] Tìm kiếm theo tiêu đề/tác giả
- [ ] Xem lịch sử duyệt bài
- [ ] Thông báo realtime cho tác giả
- [ ] Xuất báo cáo thống kê

### API mở rộng:
- `/api/manage/stats` - Thống kê tổng quan
- `/api/manage/submissions/history` - Lịch sử duyệt
- `/api/manage/users` - Quản lý người dùng

---

**Phiên bản**: 1.0  
**Cập nhật**: 2025-11-28
