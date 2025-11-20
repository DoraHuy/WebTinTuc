
import {
  getFeaturedPost,
  getLatestPosts,
  getPosts,
  getCategories,
  getTopAuthors,
  getTrendingPosts,
  getTotalPosts,
} from '@/lib/data/homepage-data';
import HomePageClient from './HomePageClient';

export default function Home() {
  // Server-side data fetching
  const featuredPost = getFeaturedPost();
  const latestPosts = getLatestPosts(4);
  const initialPosts = getPosts({ limit: 10, offset: 0 });
  const categories = getCategories();
  const topAuthors = getTopAuthors('posts', 5);
  const topInteractions = getTopAuthors('interactions', 5);
  const topRevenue = getTopAuthors('revenue', 5);
  const trendingPosts = getTrendingPosts(5);
  const totalPosts = getTotalPosts();

  return (
    <HomePageClient
      featuredPost={featuredPost}
      latestPosts={latestPosts}
      initialPosts={initialPosts}
      categories={categories}
      topAuthors={topAuthors}
      topInteractions={topInteractions}
      topRevenue={topRevenue}
      trendingPosts={trendingPosts}
      totalPosts={totalPosts}
    />
  );
}
