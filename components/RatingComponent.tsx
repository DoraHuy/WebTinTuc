'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface RatingComponentProps {
  postId: number;
  onRatingChange?: (rating: number) => void;
}

export function RatingComponent({ postId, onRatingChange }: RatingComponentProps) {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRatings();
  }, [postId]);

  const loadRatings = async () => {
    try {
      // Get user's current rating
      const authRes = await fetch('/api/auth/me');
      if (authRes.ok) {
        const userData = await authRes.json();
        const userId = userData?.user?.userId;
        if (userId) {
          const userRatingRes = await fetch(`/api/ratings?userId=${userId}&postId=${postId}`);
          if (userRatingRes.ok) {
            const data = await userRatingRes.json();
            setUserRating(data.rating || null);
          }
        }
      }

      // Get average rating
      const avgRes = await fetch(`/api/ratings/average?postId=${postId}`);
      if (avgRes.ok) {
        const data = await avgRes.json();
        setAverageRating(data.average || 0);
        setTotalRatings(data.count || 0);
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  };

  const handleRating = async (rating: number) => {
    try {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        alert('Vui lòng đăng nhập để đánh giá');
        return;
      }

      const userData = await authRes.json();
      const userId = userData?.user?.userId;
      if (!userId) return;

      setLoading(true);

      if (userRating === rating) {
        // Remove rating if clicking the same star
        const res = await fetch(`/api/ratings?userId=${userId}&postId=${postId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setUserRating(null);
          onRatingChange?.(0);
          loadRatings();
        }
      } else {
        // Add/update rating
        const res = await fetch('/api/ratings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, postId, rating }),
        });
        if (res.ok) {
          setUserRating(rating);
          onRatingChange?.(rating);
          loadRatings();
        }
      }
    } catch (error) {
      console.error('Error setting rating:', error);
      alert('Lỗi khi đánh giá bài viết');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* User's Rating */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Đánh giá của bạn:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(null)}
              disabled={loading}
              className="transition-transform hover:scale-110 disabled:opacity-50"
            >
              <Star
                className={`w-6 h-6 ${
                  star <= (hoveredRating || userRating || 0)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Average Rating */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium">Đánh giá chung:</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-muted-foreground">
            {averageRating.toFixed(1)} ({totalRatings} đánh giá)
          </span>
        </div>
      </div>
    </div>
  );
}
