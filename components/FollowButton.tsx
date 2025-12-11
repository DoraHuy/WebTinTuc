'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

interface FollowButtonProps {
  authorId: number;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ authorId, onFollowChange }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    checkFollowStatus();
    loadFollowerCount();
  }, [authorId]);

  const checkFollowStatus = async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (authRes.ok) {
        const userData = await authRes.json();
        const userId = userData?.user?.userId;
        if (userId) {
          const res = await fetch(`/api/follow?userId=${userId}&authorId=${authorId}`);
          if (res.ok) {
            const data = await res.json();
            setIsFollowing(data.isFollowing);
          }
        }
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const loadFollowerCount = async () => {
    try {
      const res = await fetch(`/api/follow/count?authorId=${authorId}`);
      if (res.ok) {
        const data = await res.json();
        setFollowerCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error loading follower count:', error);
    }
  };

  const handleToggleFollow = async () => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        alert('Vui lòng đăng nhập để theo dõi tác giả');
        return;
      }

      const userData = await authRes.json();
      const userId = userData?.user?.userId;
      if (!userId) return;

      setLoading(true);

      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, authorId }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        onFollowChange?.(data.isFollowing);
        loadFollowerCount();
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Lỗi khi theo dõi tác giả');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFollow}
      disabled={loading}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
        isFollowing
          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
          : 'bg-muted hover:bg-muted/80'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <Users className="w-5 h-5" />
      <span>{isFollowing ? 'Đã theo dõi' : 'Theo dõi'}</span>
      <span className="text-sm opacity-75">({followerCount})</span>
    </button>
  );
}
