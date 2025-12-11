import { Post } from '@/types/Homepage';
import { PostCard } from './PostCard';
import { TrendingUp, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  featuredPost: Post | null;
  latestPosts: Post[];
}

export function HeroSection({ featuredPost, latestPosts }: HeroSectionProps) {
  return (
    <section className="mb-12 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_25px_80px_-60px_rgba(0,0,0,0.9)]">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Featured Post */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary drop-shadow" />
            <h2 className="text-2xl font-bold">Nổi bật</h2>
          </div>
          {featuredPost ? (
            <PostCard post={featuredPost} variant="featured" />
          ) : (
            <div className="border border-dashed border-white/20 rounded-xl p-6 text-muted-foreground bg-background/60">
              Chưa có bài viết nổi bật.
            </div>
          )}
        </div>

        {/* Latest Posts */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent drop-shadow" />
            <h2 className="text-2xl font-bold">Mới nhất</h2>
          </div>
          <div className="space-y-4">
            {(latestPosts || []).map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
