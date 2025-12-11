"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ModeToggle } from "./ModeToggle"
import { Button } from "./ui/button"
import { Menu, Newspaper, Bookmark, MessageSquare, LogOut } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [savedPostsCount, setSavedPostsCount] = useState(0)
  const [commentsCount, setCommentsCount] = useState(0)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          setIsLoggedIn(true)
          const userId = data?.user?.userId
          if (userId) {
            // Get saved posts count
            const savedRes = await fetch(`/api/bookmarks/list?userId=${userId}`)
            if (savedRes.ok) {
              const savedData = await savedRes.json()
              setSavedPostsCount(savedData.bookmarks?.length || 0)
            }

            // Get comments count
            const commentsRes = await fetch(`/api/comments/my-comments?userId=${userId}`)
            if (commentsRes.ok) {
              const commentsData = await commentsRes.json()
              setCommentsCount(commentsData.comments?.length || 0)
            }
          }
        }
      } catch (error) {
        console.error('Auth error:', error)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-linear-to-r from-background/80 via-primary/10 to-secondary/10 backdrop-blur-2xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.65)] supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary via-accent to-secondary flex items-center justify-center text-primary-foreground shadow-[0_10px_30px_-18px_rgba(0,0,0,0.8)] ring-1 ring-white/20">
              <Newspaper className="h-5 w-5" />
            </div>
            <span className="font-bold text-xl">Tin Tức 24h</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-3 text-sm font-semibold">
            <Link href="/" className="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/10 transition-all">
              Trang chủ
            </Link>
            <Link href="/manage" className="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/10 transition-all">
              Quản lý
            </Link>
            <Link href="/TacGia/Posts" className="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/10 transition-all">
              Tác giả
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />

          {isLoggedIn && (
            <>
              <Link 
                href="/saved-posts"
                className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 font-semibold transition-all text-sm flex items-center gap-2"
              >
                <Bookmark className="w-5 h-5" />
                Đã lưu {savedPostsCount > 0 && `(${savedPostsCount})`}
              </Link>

              <Link 
                href="/my-comments"
                className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 font-semibold transition-all text-sm flex items-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Bình luận {commentsCount > 0 && `(${commentsCount})`}
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 font-semibold transition-all text-sm text-red-600 hover:text-red-500 flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Đăng xuất
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link 
                href="/login"
                className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 font-semibold transition-all text-sm"
              >
                Đăng nhập
              </Link>

              <Link 
                href="/register"
                className="px-4 py-2 rounded-lg border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 font-semibold transition-all text-sm text-blue-600 hover:text-blue-500"
              >
                Đăng ký
              </Link>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden border border-white/10 bg-white/5 hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/80 backdrop-blur-xl">
          <nav className="container flex flex-col space-y-3 py-4">
            <Link href="/" className="text-sm font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
              Trang chủ
            </Link>
            <Link href="/manage" className="text-sm font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
              Quản lý
            </Link>
            <Link href="/TacGia/Posts" className="text-sm font-semibold px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
              Tác giả
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
