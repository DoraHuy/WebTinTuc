'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User, FileText, Users, DollarSign, MessageSquare, Calendar, Award, Star } from 'lucide-react';
import { FollowButton } from '@/components/FollowButton';

type Tab = 'posts' | 'followers' | 'donors' | 'commenters';

interface AuthorProfileClientProps {
  author: any;
  posts: any[];
}

export default function AuthorProfileClient({ author, posts }: AuthorProfileClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('posts');

  const tabs = [
    { id: 'posts', label: 'Bài viết', icon: FileText, count: posts.length },
    { id: 'followers', label: 'Người theo dõi', icon: Users, count: author.followers?.length || 0 },
    { id: 'donors', label: 'Top nạp tiền', icon: DollarSign, count: author.topDonors?.length || 0 },
    { id: 'commenters', label: 'Người bình luận', icon: MessageSquare, count: author.commenters?.length || 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Profile */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <Image
                src={author.avatar || '/default-avatar.png'}
                alt={author.tenNguoiDung}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{author.tenNguoiDung}</h1>
              <p className="text-blue-100 mb-4">{author.bio || 'Tác giả TechNews'}</p>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span><strong>{author.totalPosts}</strong> bài viết</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span><strong>{author.followers?.length || 0}</strong> người theo dõi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  <span><strong>{author.averageRating || 0}</strong>/5 sao ({author.totalRatings || 0} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span><strong>{author.totalInteractions.toLocaleString()}</strong> tương tác</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span><strong>{(author.totalRevenue / 1000000).toFixed(1)}M</strong> doanh thu</span>
                </div>
              </div>
              <div>
                <FollowButton authorId={author.id} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary text-primary font-semibold'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className="ml-1 px-2 py-0.5 bg-muted rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Bài viết */}
        {activeTab === 'posts' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group bg-card rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={post.thumbnail || '/placeholder.jpg'}
                    alt={post.tenTinTuc}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {post.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                      PREMIUM
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.tenTinTuc}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {post.tomTat}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>👁 {post.viewCount?.toLocaleString()}</span>
                    <span>❤️ {post.likeCount?.toLocaleString()}</span>
                    <span>💬 {post.commentCount}</span>
                    {post.ratings && post.ratings.length > 0 && (
                      <span className="flex items-center gap-1">
                        ⭐ {(post.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / post.ratings.length).toFixed(1)} ({post.ratings.length})
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Người theo dõi */}
        {activeTab === 'followers' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {author.followers?.map((follower: any) => (
              <div key={follower.id} className="bg-card rounded-lg border p-4 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={follower.avatar}
                    alt={follower.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{follower.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Theo dõi từ {new Date(follower.followDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            )) || <p className="text-muted-foreground">Chưa có người theo dõi</p>}
          </div>
        )}

        {/* Top nạp tiền */}
        {activeTab === 'donors' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-lg border overflow-hidden">
              {author.topDonors?.map((donor: any, index: number) => (
                <div
                  key={donor.id}
                  className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{donor.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(donor.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {donor.amount.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              )) || <p className="p-8 text-center text-muted-foreground">Chưa có người nạp tiền</p>}
            </div>
          </div>
        )}

        {/* Người bình luận */}
        {activeTab === 'commenters' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {author.commenters?.map((commenter: any) => (
              <div key={commenter.id} className="bg-card rounded-lg border p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={commenter.avatar}
                      alt={commenter.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{commenter.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {commenter.totalComments} bình luận
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Bình luận gần nhất: {new Date(commenter.lastComment).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )) || <p className="text-muted-foreground">Chưa có bình luận</p>}
          </div>
        )}
      </div>
    </div>
  );
}
