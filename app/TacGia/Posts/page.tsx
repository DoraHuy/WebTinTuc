import { getAllAuthorsWithData } from '@/lib/data/homepage-data';
import AuthorPageClient from './AuthorPageClient';

export const metadata = {
  title: 'Quản lý Tác giả - TechNews',
  description: 'Thống kê và quản lý bài viết của các tác giả',
};

export default async function AuthorPage() {
  // Lấy dữ liệu thật từ Server
  const authors = await getAllAuthorsWithData();

  return (
    <AuthorPageClient authors={authors} />
  );
}