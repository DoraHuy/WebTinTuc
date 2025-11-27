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

export default async function Home() {
  // Lấy dữ liệu trực tiếp từ Database (Server-side)
  const featuredPost = await getFeaturedPost();
  const latestPosts = await getLatestPosts(4);
  const initialPosts = await getPosts({ limit: 10, offset: 0 });
  const categories = await getCategories();
  const topAuthors = await getTopAuthors('posts', 5);
  const topInteractions = await getTopAuthors('interactions', 5);
  const topRevenue = await getTopAuthors('revenue', 5);
  const trendingPosts = await getTrendingPosts(5);
  const totalPosts = await getTotalPosts();

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