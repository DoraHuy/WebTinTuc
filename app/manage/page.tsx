'use client';

import React from 'react';
import { Users, FileText, DollarSign, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';

const homepageData = require('@/public/data/homepage-data.json');

export default function ManagePages() {
  const data = homepageData;
  
  // Tính toán thống kê
  const totalPosts = data.posts.length;
  const totalAuthors = data.authors.length;
  const totalViews = data.posts.reduce((sum: number, post: any) => sum + (post.viewCount || 0), 0);
  const totalLikes = data.posts.reduce((sum: number, post: any) => sum + (post.likeCount || 0), 0);
  const totalComments = data.posts.reduce((sum: number, post: any) => sum + (post.commentCount || 0), 0);
  const totalRevenue = data.authors.reduce((sum: number, author: any) => sum + (author.totalRevenue || 0), 0);
  const premiumPosts = data.posts.filter((p: any) => p.isPremium).length;
  
  // Top tác giả
  const topAuthors = [...data.authors]
    .sort((a: any, b: any) => b.totalPosts - a.totalPosts)
    .slice(0, 5);
  
  // Top nạp tiền
  const topRevenue = [...data.authors]
    .sort((a: any, b: any) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);
  
  // Bài viết mới nhất
  const latestPosts = [...data.posts]
    .sort((a: any, b: any) => new Date(b.ngayDang).getTime() - new Date(a.ngayDang).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Quản Lý</h1>
        <p className="text-muted-foreground">Tổng quan hệ thống quản lý tin tức</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-sm">Tổng bài viết</span>
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-bold">{totalPosts}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {premiumPosts} bài premium
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-sm">Tổng tác giả</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold">{totalAuthors}</div>
          <div className="text-xs text-muted-foreground mt-1">
            Đang hoạt động
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-sm">Tổng lượt xem</span>
            <Eye className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {totalLikes.toLocaleString()} likes • {totalComments.toLocaleString()} comments
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted-foreground text-sm">Tổng doanh thu</span>
            <DollarSign className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold">{(totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-muted-foreground mt-1">
            VNĐ
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Tác Giả */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Top Tác Giả</h2>
          </div>
          <div className="space-y-3">
            {topAuthors.map((author: any, index: number) => (
              <div key={author.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{author.tenNguoiDung}</div>
                    <div className="text-sm text-muted-foreground">{author.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{author.totalPosts}</div>
                  <div className="text-xs text-muted-foreground">bài viết</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Nạp Tiền */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-yellow-500" />
            <h2 className="text-xl font-bold">Top Nạp Tiền</h2>
          </div>
          <div className="space-y-3">
            {topRevenue.map((author: any, index: number) => (
              <div key={author.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center font-bold text-yellow-600">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{author.tenNguoiDung}</div>
                    <div className="text-sm text-muted-foreground">{author.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg text-yellow-600">
                    {(author.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-muted-foreground">VNĐ</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bài Viết Mới Nhất */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold">Bài Viết Mới Nhất</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Tiêu đề</th>
                <th className="text-left p-3 font-semibold">Tác giả</th>
                <th className="text-center p-3 font-semibold">Loại</th>
                <th className="text-center p-3 font-semibold">Lượt xem</th>
                <th className="text-center p-3 font-semibold">Tương tác</th>
                <th className="text-left p-3 font-semibold">Ngày đăng</th>
              </tr>
            </thead>
            <tbody>
              {latestPosts.map((post: any) => {
                const author = data.authors.find((a: any) => a.id === post.authorId);
                return (
                  <tr key={post.id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="font-medium line-clamp-1">{post.tenTinTuc}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">{author?.tenNguoiDung}</div>
                    </td>
                    <td className="p-3 text-center">
                      {post.isPremium ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-600">
                          Premium
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.viewCount?.toLocaleString() || 0}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likeCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.commentCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {new Date(post.ngayDang).toLocaleDateString('vi-VN')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
