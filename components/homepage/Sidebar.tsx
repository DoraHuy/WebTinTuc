import { TopAuthors } from './TopAuthors';
import { TrendingPosts } from './TrendingPosts';
import { TopAuthor, TrendingPost } from '@/types/Homepage';

interface SidebarProps {
  topAuthors: TopAuthor[];
  topInteractions: TopAuthor[];
  topRevenue: TopAuthor[];
  trendingPosts: TrendingPost[];
}

export function Sidebar({
  topAuthors,
  topInteractions,
  topRevenue,
  trendingPosts,
}: SidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Top Trending Posts */}
      <TrendingPosts posts={trendingPosts} />

      {/* Top Authors by Posts */}
      <TopAuthors authors={topAuthors} type="posts" />

      {/* Top Authors by Interactions */}
      <TopAuthors authors={topInteractions} type="interactions" />

      {/* Top Authors by Revenue */}
      <TopAuthors authors={topRevenue} type="revenue" />
    </aside>
  );
}
