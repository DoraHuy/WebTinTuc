import { Post } from '@/types/Homepage';
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/data/homepage-data-mysql';
import PostDetailClient from './PostDetailClient';

export default async function PostDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const postId = parseInt(id);
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return <PostDetailClient post={post} />;
}
