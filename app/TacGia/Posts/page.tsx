'use client';

import React, { useState } from 'react';
import { FileText, Eye, Heart, MessageCircle, DollarSign, TrendingUp, Award, Crown } from 'lucide-react';

const homepageData = require('@/public/data/homepage-data.json');

export default function PostPage() {
  const data = homepageData;
  const [selectedAuthor, setSelectedAuthor] = useState<number | null>(null);
  
  // Lấy thông tin tác giả đã chọn hoặc tác giả đầu tiên
  const currentAuthor = selectedAuthor 
    ? data.authors.find((a: any) => a.id === selectedAuthor)
    : data.authors[0];
  
  // Lấy bài viết của tác giả
  const authorPosts = data.posts.filter((p: any) => p.authorId === currentAuthor?.id);
  
  // Tính tổng tương tác
  const totalViews = authorPosts.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0);
  const totalLikes = authorPosts.reduce((sum: number, p: any) => sum + (p.likeCount || 0), 0);
  const totalComments = authorPosts.reduce((sum: number, p: any) => sum + (p.commentCount || 0), 0);
  const premiumPosts = authorPosts.filter((p: any) => p.isPremium).length;

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">Trang Tác Giả</h1>
        <p className="text-muted-foreground">Quản lý và xem thông tin các tác giả</p>
      </div>

      {/* Chọn Tác Giả */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Danh Sách Tác Giả</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.authors.map((author: any) => (
            <button
              key={author.id}
              onClick={() => setSelectedAuthor(author.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                currentAuthor?.id === author.id
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold">
                  {author.tenNguoiDung[0]}
                </div>
                <div>
                  <div className="font-semibold">{author.tenNguoiDung}</div>
                  <div className="text-xs opacity-80">{author.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="font-bold">{author.totalPosts}</div>
                  <div className="opacity-80">Bài viết</div>
                </div>
                <div>
                  <div className="font-bold">{(author.totalInteractions / 1000).toFixed(1)}k</div>
                  <div className="opacity-80">Tương tác</div>
                </div>
                <div>
                  <div className="font-bold">{(author.totalRevenue / 1000000).toFixed(1)}M</div>
                  <div className="opacity-80">Doanh thu</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Thông Tin Chi Tiết Tác Giả */}
      {currentAuthor && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Tổng bài viết</span>
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{currentAuthor.totalPosts}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {premiumPosts} bài premium
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Lượt xem</span>
                <Eye className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold">{totalViews.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Tổng lượt xem
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Tương tác</span>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-3xl font-bold">{currentAuthor.totalInteractions.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {totalLikes} likes • {totalComments} comments
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Doanh thu</span>
                <DollarSign className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-3xl font-bold">{(currentAuthor.totalRevenue / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground mt-1">
                VNĐ
              </div>
            </div>
          </div>

          {/* Bài Viết Của Tác Giả */}
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Bài Viết Của {currentAuthor.tenNguoiDung}</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">ID</th>
                    <th className="text-left p-3 font-semibold">Tiêu đề</th>
                    <th className="text-center p-3 font-semibold">Loại</th>
                    <th className="text-center p-3 font-semibold">
                      <Eye className="w-4 h-4 inline" />
                    </th>
                    <th className="text-center p-3 font-semibold">
                      <Heart className="w-4 h-4 inline" />
                    </th>
                    <th className="text-center p-3 font-semibold">
                      <MessageCircle className="w-4 h-4 inline" />
                    </th>
                    <th className="text-left p-3 font-semibold">Ngày đăng</th>
                  </tr>
                </thead>
                <tbody>
                  {authorPosts
                    .sort((a: any, b: any) => new Date(b.ngayDang).getTime() - new Date(a.ngayDang).getTime())
                    .map((post: any) => (
                      <tr key={post.id} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono text-sm">#{post.id}</td>
                        <td className="p-3">
                          <div className="font-medium line-clamp-2 max-w-md">{post.tenTinTuc}</div>
                        </td>
                        <td className="p-3 text-center">
                          {post.isPremium ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-600">
                              <Crown className="w-3 h-3" />
                              Premium
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-600">
                              Free
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-center font-semibold">
                          {post.viewCount?.toLocaleString() || 0}
                        </td>
                        <td className="p-3 text-center font-semibold text-red-500">
                          {post.likeCount || 0}
                        </td>
                        <td className="p-3 text-center font-semibold text-blue-500">
                          {post.commentCount || 0}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {new Date(post.ngayDang).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
