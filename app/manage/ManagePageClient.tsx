'use client';

import React from 'react';
import { Users, FileText, DollarSign, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';
import { CommentsManagement } from './components/CommentsManagement';

interface ManagePageClientProps {
  totalPosts: number;
  totalAuthors: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalRevenue: number;
  premiumPosts: number;
  topAuthors: Array<{
    id: number;
    tenNguoiDung: string;
    email: string;
    totalPosts: number;
  }>;
  topRevenue: Array<{
    id: number;
    tenNguoiDung: string;
    email: string;
    totalRevenue: number;
  }>;
  latestPosts: Array<{
    id: number;
    tenTinTuc: string;
    tenNguoiDung: string;
    isPremium: boolean;
    ngayDang: Date;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  }>;
}

export default function ManagePageClient({
  totalPosts,
  totalAuthors,
  totalViews,
  totalLikes,
  totalComments,
  totalRevenue,
  premiumPosts,
  topAuthors,
  topRevenue,
  latestPosts,
}: ManagePageClientProps) {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h1 className="text-5xl font-bold mb-3">Dashboard Quản Lý</h1>
        <p className="text-lg text-muted-foreground">Tổng quan hệ thống quản lý tin tức</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border-2 rounded-xl p-8 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-base font-semibold">Tổng bài viết</span>
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <div className="text-5xl font-bold mb-2">{totalPosts}</div>
          <div className="text-sm text-muted-foreground">
            {premiumPosts} bài premium
          </div>
        </div>

        <div className="bg-card border-2 rounded-xl p-8 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-base font-semibold">Tổng tác giả</span>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-5xl font-bold mb-2">{totalAuthors}</div>
          <div className="text-sm text-muted-foreground">
            Đang hoạt động
          </div>
        </div>

        <div className="bg-card border-2 rounded-xl p-8 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-base font-semibold">Tổng lượt xem</span>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-5xl font-bold mb-2">{totalViews.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">
            {totalLikes.toLocaleString()} likes • {totalComments.toLocaleString()} comments
          </div>
        </div>

        <div className="bg-card border-2 rounded-xl p-8 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground text-base font-semibold">Tổng doanh thu</span>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="text-5xl font-bold mb-2">{(totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-muted-foreground">
            VNĐ
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tác Giả */}
        <div className="bg-card border-2 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-7 h-7 text-primary" />
            <h2 className="text-3xl font-bold">Top Tác Giả</h2>
          </div>
          <div className="space-y-4">
            {topAuthors.map((author, index) => (
              <div key={author.id} className="flex items-center justify-between p-5 bg-muted/50 rounded-xl hover:bg-muted/70 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-lg text-primary">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{author.tenNguoiDung}</div>
                    <div className="text-base text-muted-foreground">{author.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl">{author.totalPosts}</div>
                  <div className="text-sm text-muted-foreground">bài viết</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Nạp Tiền */}
        <div className="bg-card border-2 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-7 h-7 text-yellow-500" />
            <h2 className="text-3xl font-bold">Top Nạp Tiền</h2>
          </div>
          <div className="space-y-4">
            {topRevenue.map((author, index) => (
              <div key={author.id} className="flex items-center justify-between p-5 bg-muted/50 rounded-xl hover:bg-muted/70 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center font-bold text-lg text-yellow-600">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{author.tenNguoiDung}</div>
                    <div className="text-base text-muted-foreground">{author.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl text-yellow-600">
                    {(author.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground">VNĐ</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bài Viết Mới Nhất */}
      <div className="bg-card border-2 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-7 h-7 text-primary" />
          <h2 className="text-3xl font-bold">Bài Viết Mới Nhất</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-4 font-bold text-base">Tiêu đề</th>
                <th className="text-left p-4 font-bold text-base">Tác giả</th>
                <th className="text-center p-4 font-bold text-base">Loại</th>
                <th className="text-center p-4 font-bold text-base">Lượt xem</th>
                <th className="text-center p-4 font-bold text-base">Tương tác</th>
                <th className="text-left p-4 font-bold text-base">Ngày đăng</th>
              </tr>
            </thead>
            <tbody>
              {latestPosts.map((post) => (
                <tr key={post.id} className="border-b hover:bg-muted/50 transition-all">
                  <td className="p-4">
                    <div className="font-semibold text-base line-clamp-1">{post.tenTinTuc}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-base font-medium">{post.tenNguoiDung}</div>
                  </td>
                  <td className="p-4 text-center">
                    {post.isPremium ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-yellow-500/10 text-yellow-600">
                        Premium
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-500/10 text-green-600">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-base font-semibold">
                      <Eye className="w-5 h-5" />
                      {post.viewCount?.toLocaleString() || 0}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3 text-base">
                      <span className="flex items-center gap-1 font-semibold">
                        <Heart className="w-5 h-5" />
                        {post.likeCount || 0}
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <MessageCircle className="w-5 h-5" />
                        {post.commentCount || 0}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-base text-muted-foreground font-medium">
                    {new Date(post.ngayDang).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quản Lý Bình Luận */}
      <CommentsManagement />
    </div>
  );
}
