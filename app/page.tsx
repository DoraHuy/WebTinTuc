
import {
  getFeaturedPost,
  getLatestPosts,
  getPosts,
  getCategories,
  getTopAuthors,
  getTrendingPosts,
  getTotalPosts,
} from '@/lib/data/homepage-data-mysql';
import HomePageClient from './HomePageClient';

export default async function Home() {
  // Server-side data fetching từ MySQL
  const [
    featuredPost,
    latestPosts,
    initialPosts,
    categories,
    topAuthors,
    topInteractions,
    topRevenue,
    trendingPosts,
    totalPosts,
  ] = await Promise.all([
    getFeaturedPost(),
    getLatestPosts(4),
    getPosts({ limit: 10, offset: 0 }),
    getCategories(),
    getTopAuthors('posts', 5),
    getTopAuthors('interactions', 5),
    getTopAuthors('revenue', 5),
    getTrendingPosts(5),
    getTotalPosts(),
  ]);

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
