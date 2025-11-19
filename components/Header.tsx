"use client"

import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { Button } from "./ui/button"
import { Menu, Newspaper } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Newspaper className="h-6 w-6" />
            <span className="font-bold text-xl">Tin Tức 24h</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">
              Trang chủ
            </Link>
            <Link href="/manage" className="transition-colors hover:text-foreground/80">
              Quản lý
            </Link>
            <Link href="/TacGia/Posts" className="transition-colors hover:text-foreground/80">
              Tác giả
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ModeToggle />
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost">Đăng nhập</Button>
            </Link>
            <Link href="/register">
              <Button>Đăng ký</Button>
            </Link>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container flex flex-col space-y-3 py-4">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Trang chủ
            </Link>
            <Link href="/manage" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Quản lý
            </Link>
            <Link href="/TacGia/Posts" className="text-sm font-medium transition-colors hover:text-foreground/80">
              Tác giả
            </Link>
            <div className="flex gap-2 pt-2 border-t">
              <Link href="/login" className="flex-1">
                <Button variant="ghost" className="w-full">Đăng nhập</Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button className="w-full">Đăng ký</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
