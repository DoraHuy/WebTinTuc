import { Newspaper } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Newspaper className="h-6 w-6" />
              <span className="font-bold text-lg">Tin Tức 24h</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Cập nhật tin tức mới nhất mỗi ngày
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Danh mục</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Tin mới</Link></li>
              <li><Link href="/" className="hover:text-foreground">Thời sự</Link></li>
              <li><Link href="/" className="hover:text-foreground">Kinh tế</Link></li>
              <li><Link href="/" className="hover:text-foreground">Thể thao</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Liên hệ</Link></li>
              <li><Link href="/" className="hover:text-foreground">Về chúng tôi</Link></li>
              <li><Link href="/" className="hover:text-foreground">Điều khoản</Link></li>
              <li><Link href="/" className="hover:text-foreground">Bảo mật</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Theo dõi</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Facebook</Link></li>
              <li><Link href="/" className="hover:text-foreground">Twitter</Link></li>
              <li><Link href="/" className="hover:text-foreground">Instagram</Link></li>
              <li><Link href="/" className="hover:text-foreground">YouTube</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Tin Tức 24h. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
