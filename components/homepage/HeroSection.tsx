import { Post } from '@/lib/types/Homepage';
import { PostCard } from './PostCard';
import { TrendingUp, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  featuredPost: Post;
  latestPosts: Post[];
}

export function HeroSection({ featuredPost, latestPosts }: HeroSectionProps) {
  return (
    <section className="mb-12">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Featured Post */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">Nổi bật</h2>
          </div>
          <PostCard post={featuredPost} variant="featured" />
        </div>

        {/* Latest Posts */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">Mới nhất</h2>
          </div>
          <div className="space-y-4">
            {latestPosts.map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
